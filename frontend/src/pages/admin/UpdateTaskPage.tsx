import DashboardLayout from "@/components/partials/DashboardLayout";
import AddAttachmentsInput from "@/components/ui/AddAttachmentsInput";
import Button from "@/components/ui/Button";
import DeleteAlert from "@/components/ui/DeleteAlert";
import Modal from "@/components/ui/Modal";
import SelectDropdown from "@/components/ui/SelectDropdown";
import SelectUsers from "@/components/ui/SelectUsers";
import TodoListInput from "@/components/ui/TodoListInput";
import { useTasks } from "@/hooks/api/useTasks";
import { toast } from "@/libraries/sweetalert2";
import { taskSchema, type TaskSchema } from "@/schemas";
import { taskService } from "@/services";
import { priorityData } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { LuTrash2 } from "react-icons/lu";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTaskPage = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskSchema>({
    defaultValues: {
      title: "",
      description: "",
      priority: "Low",
      status: "Pending",
      dueDate: new Date().toISOString(),
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    },
    resolver: zodResolver(taskSchema),
  });

  const { id: taskId } = useParams() as Record<string, string>;
  const { mutateAsync } = useTasks("update-task");
  const { mutateAsync: deleteTaskAsync } = useTasks("delete-task");

  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const getTaskDetailsByID = async () => {
    const formatTaskToSchema = (data: taskService.Task) => {
      return {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate.split("T")[0],
        assignedTo: data.assignedTo.map((u) => u._id),
        todoChecklist: data.todoChecklist,
        attachments: data.attachments,
      };
    };

    return formatTaskToSchema((await taskService.getTaskById(taskId!)).data);
  };

  const updateTask: SubmitHandler<TaskSchema> = async (data) => {
    try {
      const { message } = await mutateAsync({ taskId, data });
      toast.success(message!);
      navigate(`/tasks/${taskId}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setOpenDeleteAlert(false);
      const { message } = await deleteTaskAsync(taskId);
      toast.success(message!);
      navigate("/admin/tasks");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID()
        .then((data) => reset(data))
        .catch((err: any) => {
          toast.error(err.message);
        });
    }
  }, [taskId]);

  const error = Object.values(errors)[0]?.message || undefined;

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <motion.div
            className="form-card col-span-3 md:col-span-4 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-red-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                type="text"
                className="form-input"
                placeholder="Create App UI"
                {...register("title")}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>

              <textarea
                placeholder="Describe Task"
                className="form-input resize-none"
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-12 col-span-2 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={priorityData}
                  control={control}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>

                <input
                  type="date"
                  className="form-input"
                  {...register("dueDate", {
                    setValueAs(value: string) {
                      return value ? new Date(value).toISOString() : value;
                    },
                  })}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium">Assign To</label>

                <SelectUsers control={control} />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>

              <TodoListInput control={control} />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>

              <AddAttachmentsInput control={control} />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <Button
                className="add-btn"
                onClick={handleSubmit(updateTask)}
                disabled={isSubmitting}
                loadingState={{
                  message: "Updating Task...",
                  isLoading: isSubmitting,
                }}
                text="Update Task"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={handleDeleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default UpdateTaskPage;
