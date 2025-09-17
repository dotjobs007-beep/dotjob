import { Router } from "express";
import UserController from "../controllers/user.controller";
import {firebaseAuth} from "../middlewares/firebase.middleware"
import { validateSecret } from "../middlewares/validate_secret.middleware";
import { validateAuthorization, validateBody } from "../middlewares/validator";
import { updateSchema } from "../schema/user";
const router = Router();
const userController = new UserController();

// Firebase signup/login
router.post("/auth", firebaseAuth, userController.loginOrRegister);
router.get("/profile", validateAuthorization, userController.fetchUserProfile);
router.post("/update-profile", validateAuthorization, validateBody(updateSchema), userController.updateProfile);
router.patch("/connect-wallet/:address", validateAuthorization, userController.connectWallet);



export default router;
