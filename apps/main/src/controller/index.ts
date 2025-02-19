import { prisma } from "@repo/userdb/user";
import { Request, Response } from "express";


export const signin = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.create({
            data: req.body
        })

        console.log(user)

        res.send(`The user was created : ${user}`)

    } catch (e) {
        console.error("Something went wrong in the singin controller")
    }
}