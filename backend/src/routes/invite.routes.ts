import { Router } from "express";
import { adminOnly, protect } from "@/middlewares/auth.middleware";
import * as inviteController from "@/controllers/invite.controller";
import { validate } from "@/middlewares/validate.middleware";
import { inviteSchema } from "@/schemas/invite.schema";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.post("/new", validate(inviteSchema), inviteController.getInviteCode);

export default router;
