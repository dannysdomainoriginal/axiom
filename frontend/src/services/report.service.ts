import api from "@/libraries/axios";

export const downloadTasksReport = async (): Promise<void> => {
  try {
    const res = await api.get("/reports/tasks/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: res.headers["content-type"] });

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Axiom_Tasks_Report.xlsx";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(link.href);
  } catch (error: any) {
    console.error("Failed to download Tasks Report:", error);
    throw error.response?.data || { message: "Error downloading tasks report" };
  }
};

export const downloadUsersReport = async (): Promise<void> => {
  try {
    const res = await api.get("/reports/users/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: res.headers["content-type"] });

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Axiom_Users_Report.xlsx";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(link.href);
  } catch (error: any) {
    console.error("Failed to download Users Report:", error);
    throw error.response?.data || { message: "Error downloading users report" };
  }
};
