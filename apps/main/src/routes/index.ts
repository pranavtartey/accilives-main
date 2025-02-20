import express from "express"
import { signin, signup, verifyOtp } from "../controller/index.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);

export { router }