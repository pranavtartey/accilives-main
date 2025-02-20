import { UserSchema, OtpSchema } from "@repo/common/types";
import { prisma } from "@repo/userdb/user";
import { Request, Response } from "express";


const randomOtpGenerator = (): string => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const signin = async (req: Request, res: Response) => {
    try {

        const parsedData = UserSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.send({
                success: parsedData.success,
                message: "Invalid Input in signin controller"
            })
            return
        }

        if (parsedData.data.type === "phoneNumber") {
            const user = await prisma.user.findFirst({
                where: {
                    phoneNumber: parsedData.data.phoneNumber
                }
            })
            if (!user) {
                res.status(401).send({
                    success: false,
                    message: "Invalid User details"
                })
                return
            }

            const otp = randomOtpGenerator();

            const userOtp = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    otp
                }
            })

            setTimeout(async () => {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        otp: ""
                    }
                })
            }, 300000)

            res.status(200).send({
                otp
            })
            return;

        } else if (parsedData.data.type === "email") {
            const user = await prisma.user.findFirst({
                where: {
                    email: parsedData.data.email
                }
            })
            if (!user) {
                res.status(401).send({
                    success: false,
                    message: "Invalid User details"
                })
                return
            }
            const otp = randomOtpGenerator();

            const userOtp = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    otp
                }
            })

            setTimeout(async () => {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        otp: ""
                    }
                })
            }, 300000)

            res.status(200).send({
                otp
            })
            return;
        } else {
            res.status(401).send({
                success: false,
                message: "Invalid user details"
            })
        }
    } catch (e) {
        console.error("Something went wrong in the singin controller")
        res.send({
            message: "Something went wrong in the singin controller"
        })
    }
}

export const signup = async (req: Request, res: Response) => {
    try {

        const parsedData = UserSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(401).send({
                success: false,
                message: "Invalid user details",
                error: parsedData.error
            })
            return
        }
        const user = await prisma.user.create({
            data: {
                name: parsedData.data.name,
                password: parsedData.data.password,
                email: parsedData.data.email ?? "",
                phoneNumber: parsedData.data.phoneNumber ?? ""
            }
        })

        console.log(`This is the created user : ${user}`)

        res.status(200).send({
            id: user.id
        })

    } catch (e) {
        console.error("Something went wrong in the signup controller")
        res.send({
            message: "Something went wrong in the signup controller"
        })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    const parsedData = OtpSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(403).send({
            message: "Invalid Otp"
        })
        return;
    }

    const { email, otp, phoneNumber } = req.body;

    if (email) {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!user) {
            res.status(401).send({
                success: false,
                message: "invalid email"
            })
            return
        }

        if (user.otp === otp) {
            res.status(200).send({
                success: true,
                message: "otp verified successfully"
            })
            return;
        } else {
            res.status(401).send({
                success: false,
                message: "otp verifcation failed"
            })
            return
        }
    } else {
        const user = await prisma.user.findFirst({
            where: {
                phoneNumber
            }
        })
        if (!user) {
            res.status(401).send({
                success: false,
                message: "invalid phone number"
            })
            return
        }
        if (user.otp === otp) {
            res.status(200).send({
                success: true,
                message: "otp verified successfully"
            })
            return
        } else {
            res.status(401).send({
                success: false,
                message: "otp verifcation failed"
            })
            return;
        }
    }


    // if (req.body.type === "email") {
    //     const user = await prisma.user.findFirst({
    //         where: {
    //             email: req.body.email
    //         }
    //     })
    //     if (!user) {
    //         res.status(401).send({
    //             success: false,
    //             message: "invalid email"
    //         })
    //         return
    //     }

    //     if (user.otp === req.body.otp) {
    //         res.status(200).send({
    //             success: true,
    //             message: "otp verified successfully"
    //         })
    //     } else {
    //         res.status(401).send({
    //             success: false,
    //             message: "otp verifcation failed"
    //         })
    //     }

    // } else if (req.body.type === "phoneNumber") {
    //     const user = await prisma.user.findFirst({
    //         where: {
    //             email: req.body.phoneNumber
    //         }
    //     })
    //     if (!user) {
    //         res.status(401).send({
    //             success: false,
    //             message: "invalid phone number"
    //         })
    //         return
    //     }
    //     if (user.otp === req.body.otp) {
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