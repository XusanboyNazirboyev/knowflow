/**
 * AppRouter — markaziy routing konfiguratsiya.
 * Public: landing, login, register, forgot/reset password.
 * Protected: /app/* — AppLayout ichida, auth talab qiladi.
 */
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { WorkspaceProvider } from "./store/workspaceContext";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Chat from "./pages/Chat";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import { ROUTES } from "./lib/constants";
import { Spinner } from "./components/ui/Spinner";

/** Auth talab qiladigan routelarni o'raydi */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <WorkspaceProvider>
            <AppLayout />
          </WorkspaceProvider>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="documents" element={<Documents />} />
      <Route path="documents/:id" element={<Documents />} />
      <Route path="chat" element={<Chat />} />
      <Route path="chat/:id" element={<Chat />} />
      <Route path="members" element={<Members />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
  </Routes>
);

export const AppRouter: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default AppRouter;