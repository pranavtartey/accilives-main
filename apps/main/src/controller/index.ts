import { UserSchema, OtpSchema } from "@repo/common/types";
import { prisma } from "@repo/userdb/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { Request, Response } from "express";


type User = {
    otp: string,
    phoneNumber?: string,
    email?: string,
    password?: string,
    name?: string
    type: string
    isSignin?: boolean
}

enum Type {
    PHONENUMBER = "phoneNumber",
    EMAIL = "email"
}

const users: User[] = []

const randomOtpGenerator = (): string => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const signup = async (req: Request, res: Response) => {
    const { email, phoneNumber, password, name, type } = req.body;

    console.log("here", req.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = randomOtpGenerator();
        users.push({
            otp,
            name,
            password: hashedPassword,
            phoneNumber,
            email,
            type,
            isSignin: false
        })

        setTimeout(() => {
            const index = users.findIndex(user => user.otp === otp);
            if (index !== -1) {
                users.splice(index, 1);
            }
        }, 18000)

        res.status(200).send({
            success: true,
            otp
        });
        return
    } catch (err) {
        console.log("Something went wrong in the signup controller : ", err);
        res.send({
            success: false,
            message: `something went wrong in the signup controller : ${err}`
        })
        return
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber, password, type } = req.body;
        const user = await prisma.auth.findFirst({
            where: {
                OR: [
                    { email },
                    { phoneNumber }
                ]
            }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
            return;
        }

        const otp = randomOtpGenerator();
        if (type === "phoneNumber") {
            users.push({
                otp,
                password,
                phoneNumber,
                type,
                isSignin: true
            })
        }
        else if (type === "email") {

            users.push({
                otp,
                password,
                email,
                type,
                isSignin: true
            })
        }

        setTimeout(() => {
            const index = users.findIndex(user => user.otp === otp);
            if (index !== -1) {
                users.splice(index, 1);
            }
        }, 18000)

        res.status(200).send({
            success: true,
            otp
        });
        return

    } catch (err) {
        res.status(400).json({
            success: false,
            message: "something went wrong in the signin controller", err
        })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {

    const { otp, type } = req.body;

    const user = users.find(user => user.otp === otp);

    if (!user) {
        res.json({
            success: false,
            message: "OTP verification failed"
        })
        return;
    }
    if (user.type === "phoneNumber") {
        try {
            if (user.isSignin == false) {
                const result = await prisma.$transaction(async prisma => {
                    if (user.type === "phoneNumber") {
                        const createdUser = await prisma.user.create({
                            data: {
                                name: user.name as string,
                                password: user.password as string,
                                phoneNumber: user.phoneNumber,
                                email: "",
                                isActive: true,
                            }
                        })
                        const auth = await prisma.auth.create({
                            data: {
                                name: user.name as string,
                                password: user.password as string,
                                phoneNumber: user.phoneNumber,
                                email: "",
                                userid: createdUser.id,
                            },
                        });
                        return { auth, createdUser }
                    } else if (user.type === "email") {
                        const createdUser = await prisma.user.create({
                            data: {
                                name: user.name as string,
                                password: user.password as string,
                                email: user.email,
                                phoneNumber: "",
                                isActive: true,
                            }
                        })
                        const auth = await prisma.auth.create({
                            data: {
                                name: user.name as string,
                                password: user.password as string,
                                phoneNumber: "",
                                email: user.email,
                                userid: createdUser.id,
                            },
                        });
                        return { auth, createdUser }
                    }
                })
                if (result?.createdUser) {
                    const { createdUser } = result;
                    const token = jwt.sign({ userId: createdUser.id }, "my-jwt-secret")
                    res.status(200).json({
                        token,
                        success: true
                    })
                    return;
                }
            } else {
                if (user.type === "phoneNumber") {
                    const foundUser = await prisma.user.findFirst({
                        where: {
                            phoneNumber: user.phoneNumber
                        }
                    });

                    if (!foundUser) {
                        res.status(402).json({
                            success: false,
                            message: "Invalid credentials"
                        })
                        return;
                    }

                    const isValidPassword = await bcrypt.compare(user.password!, foundUser?.password);
                    if (isValidPassword) {
                        const token = jwt.sign({ userId: foundUser.id }, "my-jwt-token");
                        res.status(200).json({
                            token,
                            message: "User signin successfull"
                        })
                        return;
                    }
                } else if (user.type === "email") {
                    const foundUser = await prisma.user.findFirst({
                        where: {
                            email: user.email
                        }
                    });

                    if (!foundUser) {
                        res.status(402).json({
                            success: false,
                            message: "Invalid credentials"
                        })
                        return;
                    }

                    const isValidPassword = await bcrypt.compare(user.password!, foundUser?.password);
                    if (isValidPassword) {
                        const token = jwt.sign({ userId: foundUser.id }, "my-jwt-token");
                        res.status(200).json({
                            token,
                            message: "User signin successfull"
                        })
                        return;
                    }
                }
            }
        } catch (err) {
            console.log("something went wrong in the verifyOtp controller for signup");
            res.status(400).json({
                success: false,
                message: "something went wrong in the verifyOtp controller for signup"
            })
            return;
        }
    }
}