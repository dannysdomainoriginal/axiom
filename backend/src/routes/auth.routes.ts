import { Router } from "express";
import { adminOnly, protect } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as authController from "@/controllers/auth.controller";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "@/schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", protect, authController.logout);
router.get("/profile", protect, authController.getProfile);
router.get("/admin-invite", protect, adminOnly, authController.issueToken);

router.patch(
  "/profile",
  protect,
  validate(updateProfileSchema),
  authController.updateProfile,
);

export default router;
