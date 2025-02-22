import { UserSchema, OtpSchema } from "@repo/common/types";
import { prisma } from "@repo/userdb/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";


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
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    phoneNumber,
                    name,
                    isActive: true,
                },
            });

            const auth = await prisma.auth.create({
                data: {
                    email,
                    password: hashedPassword,
                    phoneNumber,
                    name,
                    userid: user.id,
                },
            });

            console.log("This is your result : ", { user, auth })

        });
        res.status(200).send({
            success: true,
            message: "The user and auth were create successfully"
        });
        return
    } catch (err) {
        console.log("Something went wrong in the signup controller : ", err),
            res.send({
                success: false,
                message: `something went wrong in the signup controller : ${err}`
            })
        return
    }
}

export const signin = async (req: Request, res: Response) => {
    // try {

    //     const parsedData = UserSchema.safeParse(req.body);
    //     if (!parsedData.success) {
    //         res.status(401).send({
    //             success: false,
    //             message: "Invalid user details",
    //             error: parsedData.error
    //         })
    //         return
    //     }
    //     const user = await prisma.user.create({
    //         data: {
    //             name: parsedData.data.name,
    //             password: parsedData.data.password,
    //             email: parsedData.data.email ?? "",
    //             phoneNumber: parsedData.data.phoneNumber ?? ""
    //         }
    //     })

    //     console.log(`This is the created user : ${user}`)

    //     res.status(200).send({
    //         id: user.id
    //     })

    // } catch (e) {
    //     console.error("Something went wrong in the signup controller")
    //     res.send({
    //         message: "Something went wrong in the signup controller"
    //     })
    // }
}

export const verifyOtp = async (req: Request, res: Response) => {
    // const parsedData = OtpSchema.safeParse(req.body);
    // if (!parsedData.success) {
    //     res.status(403).send({
    //         message: "Invalid Otp"
    //     })
    //     return;
    // }

    // const { email, otp, phoneNumber } = req.body;

    // if (email) {
    //     const user = await prisma.user.findFirst({
    //         where: {
    //             email
    //         }
    //     })
    //     if (!user) {
    //         res.status(401).send({
    //             success: false,
    //             message: "invalid email"
    //         })
    //         return
    //     }

    //     if (user.otp === otp) {
    //         res.status(200).send({
    //             success: true,
    //             message: "otp verified successfully"
    //         })
    //         return;
    //     } else {
    //         res.status(401).send({
    //             success: false,
    //             message: "otp verifcation failed"
    //         })
    //         return
    //     }
    // } else {
    //     const user = await prisma.user.findFirst({
    //         where: {
    //             phoneNumber
    //         }
    //     })
    //     if (!user) {
    //         res.status(401).send({
    //             success: false,
    //             message: "invalid phone number"
    //         })
    //         return
    //     }
    //     if (user.otp === otp) {
    //         res.status(200).send({
    //             success: true,
    //             message: "otp verified successfully"
    //         })
    //         return
    //     } else {
    //         res.status(401).send({
    //             success: false,
    //             message: "otp verifcation failed"
    //         })
    //         return;
    //     }
    // }
}