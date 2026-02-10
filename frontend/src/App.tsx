import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReactHookForm from "./RHF";
import { useAuth } from "./context/userContext";

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
import AuthRoute from "./components/routes/AuthRoute";

const App = () => {
  const { user } = useAuth();
  console.log(user);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRoute />}>
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    !user
                      ? "/login"
                      : user.roles.includes("admin")
                        ? "/admin/dashboard"
                        : "/user/dashboard"
                  }
                />
              }
            />
            
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<PrivateRoute allowedRoles={["admin"]} />}
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tasks" element={<ManageTasksPage />} />
            <Route path="create-task" element={<CreateTaskPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="users/:id" element={<ManageUsersPage />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/user"
            element={<PrivateRoute allowedRoles={["member"]} />}
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
