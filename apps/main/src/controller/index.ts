import { CreateSchema } from "@repo/common/types";
import { prisma } from "@repo/userdb/user";
import { Request, Response } from "express";

export const signin = async (req: Request, res: Response) => {
    try {

        const parsedData = CreateSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.send({
                success: parsedData.success,
                message: "something went wrong in the signin controller"
            })
            return
        }

        const user = await prisma.user.create({
            data: parsedData.data
        })

        console.log(user)

        res.send(`The user was created : ${user}`)

    } catch (e) {
        console.error("Something went wrong in the singin controller")
        res.send({
            message: "Something went wrong in the singin controller"
        })
    }
}