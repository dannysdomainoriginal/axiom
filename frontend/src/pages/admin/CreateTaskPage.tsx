import DashboardLayout from "@/components/partials/DashboardLayout";
import { taskSchema, type TaskSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CreateTaskPage = () => {
  const [currentTask, setCurrentTask] = useState(null)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskSchema>({
    defaultValues: {
      title: "",
      description: "",
      priority: "Low",
      dueDate: new Date().toISOString(),
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    },
    resolver: zodResolver(taskSchema)
  });



  return <DashboardLayout>Create Task</DashboardLayout>;
};

export default CreateTaskPage;
