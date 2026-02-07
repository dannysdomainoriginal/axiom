import { Router } from "express";
import { adminOnly, protect } from "@/middlewares/auth.middleware";
import * as reportController from "@/controllers/report.controller";

const router = Router();

router.use(protect)
router.use(adminOnly)

router.get("/tasks/export", reportController.exportTasksReport)
router.get("/users/export", reportController.exportUsersReport);

export default router;
