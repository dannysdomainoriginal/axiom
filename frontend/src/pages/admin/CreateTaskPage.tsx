import DashboardLayout from "@/components/partials/DashboardLayout";
import AddAttachmentsInput from "@/components/ui/AddAttachmentsInput";
import Button from "@/components/ui/Button";
import SelectDropdown from "@/components/ui/SelectDropdown";
import SelectUsers from "@/components/ui/SelectUsers";
import TodoListInput from "@/components/ui/TodoListInput";
import { useTasks } from "@/hooks/api/useTasks";
import { toast } from "@/libraries/sweetalert2";
import { taskSchema, type TaskSchema } from "@/schemas";
import { priorityData } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";

const CreateTaskPage = () => {
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

  const { mutateAsync } = useTasks("add-task")

  const createTask: SubmitHandler<TaskSchema> = async (data) => {
    try {
      const { message } = await mutateAsync(data)
      toast.success(message!)
      reset()
    } catch (err: any) {
      toast.error(err.message)
    }
  };

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
              <h2 className="text-xl md:text-xl font-medium">Create Task</h2>
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
              <p className="text-base font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <Button
                className="add-btn"
                onClick={handleSubmit(createTask)}
                disabled={isSubmitting}
                loadingState={{
                  message: "Creating Task...",
                  isLoading: isSubmitting,
                }}
                text="Create Task"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTaskPage;
