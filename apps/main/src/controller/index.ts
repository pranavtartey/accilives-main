import { Request, Response } from "express";

export const signin = (req: Request, res: Response) => {
    res.send("This app is workin fine and you have signed up")
}