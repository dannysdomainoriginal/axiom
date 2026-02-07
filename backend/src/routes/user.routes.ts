import { Router } from "express";
import { adminOnly, protect } from "@/middlewares/auth.middleware";
import { validObjectId } from "@/middlewares/validate.middleware";
import * as userController from "@/controllers/user.controller";

const router = Router();

router.use(protect);
router.get("/", adminOnly, userController.getUsers);

router.get(
  "/:id",
  adminOnly,
  validObjectId(["id"]),
  userController.getUserById,
);

export default router;
