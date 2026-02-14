import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReactHookForm from "./RHF";
import { useAuth } from "./hooks/api/useAuth";
import { cn } from "./utils";

import ProtectedRoute from "./components/routes/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import AdminDashboard from "./pages/admin/DashboardPage";
import ManageTasksPage from "./pages/admin/ManageTasksPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import CreateTaskPage from "./pages/admin/CreateTaskPage";

import UserDashboard from "./pages/user/UserDashboardPage";
import MyTasksPage from "./pages/user/MyTasksPage";
import TasksDetailsPage from "./pages/user/TasksDetailsPage";
import AuthRoute from "./components/routes/AuthRoute";
import UpdateTaskPage from "./pages/admin/UpdateTaskPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const { user, loading } = useAuth();

  return (
    <div
      className={cn(
        "transition-opacity duration-500 ease-in",
        !loading ? "opacity-100" : "opacity-0",
      )}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRoute />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRole={"admin"} />}
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tasks" element={<ManageTasksPage />} />
            <Route path="create-task" element={<CreateTaskPage />} />
            <Route path="update-task/:id" element={<UpdateTaskPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="users/:id" element={<ManageUsersPage />} />

            {/* Not Found */}
            <Route index element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Other Routes */}
          <Route path="/" element={<ProtectedRoute allowedRole={"member"} />}>
            {/* User Routes */}
            <Route path="user">
              <Route index element={<NotFoundPage />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="tasks" element={<MyTasksPage />} />
            </Route>

            {/* Task Routes */}
            <Route path="tasks">
              <Route path=":id" element={<TasksDetailsPage />} />
            </Route>

            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
