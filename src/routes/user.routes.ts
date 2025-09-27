import { Router } from "express";
import UserController from "../controllers/user.controller";
import {firebaseAuth} from "../middlewares/firebase.middleware"
import { validateSecret } from "../middlewares/validate_secret.middleware";
import { validateAuthorization, validateBody } from "../middlewares/validator";
import { updateSchema } from "../schema/user";
import { validateToken } from "../middlewares/validate_token";
const router = Router();
const userController = new UserController();

// Firebase signup/login
router.post("/auth", firebaseAuth, userController.loginOrRegister);
router.get("/profile", validateToken, userController.fetchUserProfile);
router.patch("/update-profile", validateToken, validateBody(updateSchema), userController.updateProfile);
router.patch("/connect-wallet/:address", validateToken, userController.connectWallet);
router.post("/logout", validateToken, userController.logout);




export default router;
