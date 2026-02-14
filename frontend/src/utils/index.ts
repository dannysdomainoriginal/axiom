export const addThousandsSeparator = (num: number) => {
  if (num === null || isNaN(num)) return "";

  const [integer, fraction] = num.toString().split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction ? `${formattedInteger}.${fraction}` : formattedInteger;
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ChecklistItem = {
  text: string;
  completed: boolean;
};

type TaskStatus = "Pending" | "In Progress" | "Completed";

export function getStatusAndProgress(
  todoChecklist: ChecklistItem[],
): [TaskStatus, number] {
  const total = todoChecklist.length;

  const completed = todoChecklist.reduce(
    (count, item) => count + (item.completed ? 1 : 0),
    0,
  );

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  let status: TaskStatus;

  if (progress === 100) {
    status = "Completed";
  } else if (progress > 0) {
    status = "In Progress";
  } else {
    status = "Pending";
  }

  return [status, progress];
}
