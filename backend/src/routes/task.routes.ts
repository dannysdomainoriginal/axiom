import { Router } from "express";
import { adminOnly, protect } from "@/middlewares/auth.middleware";
import { validObjectId, validate } from "@/middlewares/validate.middleware";
import {
  createTaskSchema,
  updateStatusSchema,
  updateTaskSchema,
} from "@/schemas/task.schema";
import {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  // updateTaskChecklist,
} from "@/controllers/task.controller.js";

const router = Router();

router.use(protect);
router.get("/dashboard-data", getDashboardData);
router.get("/user-dashboard-data", getUserDashboardData);

router.get("/", getTasks);
router.post("/", adminOnly, validate(createTaskSchema), createTask);
router.get("/:taskId", validObjectId(["taskId"]), getTaskById);

router.patch(
  "/:taskId",
  validObjectId(["taskId"]),
  validate(updateTaskSchema),
  updateTask,
);

router.delete("/:taskId", adminOnly, validObjectId(["taskId"]), deleteTask);

router.patch(
  "/:taskId/status",
  validObjectId(["taskId"]),
  validate(updateStatusSchema),
  updateTaskStatus,
);
// router.put("/:taskId/todo", validObjectId(["taskId"]), updateTaskChecklist);

export default router;
