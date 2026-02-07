import { Router } from "express";
import os from "os";
import formData from "express-form-data";

import authRoutes from "./auth.routes";
import reportRoutes from "./report.routes";
import taskRoutes from "./task.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use(
  formData.parse({
    uploadDir: os.tmpdir(),
    autoClean: true,
  }),
  formData.format(),
);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/reports", reportRoutes);

export default router;
