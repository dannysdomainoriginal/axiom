import DashboardLayout from "@/components/partials/DashboardLayout";
import AvatarGroup from "@/components/ui/AvatarGroup";
import {
  Attachment,
  InfoBox,
  TodoChecklist,
} from "@/components/ui/TaskDetailComponents";
import { useAuth } from "@/hooks/api/useAuth";
import { useEditTask, useTask } from "@/hooks/api/useTask";
import moment from "moment";
import { Link, useParams } from "react-router-dom";

const TasksDetailsPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const { data: task, isLoading, isError, error } = useTask(id!);
  const { mutateAsync: editTask, isPending } = useEditTask(id!);

  const toggleChecklist = (idx: number) => {
    if (!task) return;

    const checklist = task.todoChecklist.map((item, i) =>
      i === idx ? { ...item, completed: !item.completed } : item,
    );

    editTask(checklist);
  };

  const getStatusTagColor = () => {
    switch (task?.status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Handle attachement link click
  const handleLinkClick = (link: string) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link; // Default to HTTPS
    }

    window.open(link, "_blank");
  };

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          {isLoading ? (
            <div className="form-card h-70 animate-pulse col-span-full"></div>
          ) : (
            <div className="form-card col-span-full">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-xl font-medium">
                  {task ? task.title : "Task Details"}
                </h2>

                {task && (
                  <div
                    className={`text-[13px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
                  >
                    {task.status}
                  </div>
                )}
              </div>

              {isError ? (
                <p className="mt-6 text-red-500 text-sm col-span-full">
                  {error.message}
                </p>
              ) : (
                task && (
                  <>
                    <div className="mt-4">
                      <InfoBox label="Description" value={task.description} />
                    </div>

                    <div className="grid grid-cols-12 gap-4 mt-4">
                      <div className="col-span-6 md:col-span-4">
                        <InfoBox label="Priority" value={task.priority} />
                      </div>
                      <div className="col-span-6 md:col-span-4">
                        <InfoBox
                          label="Due Date"
                          value={
                            task.dueDate
                              ? moment(task.dueDate).format("Do MMM YYYY")
                              : "N/A"
                          }
                        />
                      </div>
                      <div className="col-span-6 md:col-span-4">
                        <label className="text-xs font-medium to-slate-500">
                          Assigned To
                        </label>

                        <AvatarGroup
                          avatars={task.assignedTo.map(
                            (i) => i.profileImageUrl,
                          )}
                          maxVisible={5}
                        />
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-5 md:mt-2 mb-4">
                        <Link
                          to={`/admin/update-task/${id}`}
                          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary bg-blue-50 border border-blue-100 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-100 hover:border-blue-200 duration-200"
                        >
                          Update Details
                        </Link>
                      </div>
                    )}

                    <div className="mt-2">
                      <label className="text-xs font-medium text-slate-500">
                        Todo Checklist
                      </label>

                      {task.todoChecklist.length ? (
                        task.todoChecklist.map((item, idx) => (
                          <TodoChecklist
                            key={idx}
                            text={item.text}
                            isChecked={item.completed}
                            onChange={() => toggleChecklist(idx)}
                          />
                        ))
                      ) : (
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          This checklist is empty
                        </p>
                      )}
                    </div>

                    <div className="mt-2">
                      <label className="text-xs font-medium text-slate-500">
                        Attachments
                      </label>

                      {task.attachments.length ? (
                        task.attachments.map((link, idx) => (
                          <Attachment
                            key={idx}
                            link={link}
                            index={idx}
                            onClick={() => handleLinkClick(link)}
                          />
                        ))
                      ) : (
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          This task has no attachments
                        </p>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TasksDetailsPage;
