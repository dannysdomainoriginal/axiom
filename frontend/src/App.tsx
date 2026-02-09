import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactHookForm from "./RHF";

import PrivateRoute from "./components/routes/PrivateRoute";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import AdminDashboard from "./pages/admin/DashboardPage";
import ManageTasksPage from "./pages/admin/ManageTasksPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import CreateTaskPage from "./pages/admin/CreateTaskPage";

import UserDashboard from "./pages/user/UserDashboardPage";
import MyTasksPage from "./pages/user/MyTasksPage";
import TasksDetailsPage from "./pages/user/TasksDetailsPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<PrivateRoute allowedRoles={["admin"]} />}
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tasks" element={<ManageTasksPage />} />
            <Route path="create-task" element={<CreateTaskPage />} />
            <Route path="users" element={<ManageUsersPage />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/user"
            element={<PrivateRoute allowedRoles={["admin"]} />}
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="tasks/:id" element={<TasksDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
