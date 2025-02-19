import express from "express"
import { signin } from "../controller/index.js";

const router = express.Router();

router.post("/signin", signin)

export { router }