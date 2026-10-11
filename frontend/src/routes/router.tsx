import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppShell } from "../layouts/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { BuildsPage } from "../pages/BuildsPage";
import { ExpensesPage } from "../pages/ExpensesPage";
import { GaragePage } from "../pages/GaragePage";
import { MaintenancePage } from "../pages/MaintenancePage";
import { AddVehiclePage } from "../pages/AddVehiclePage";
import { VehicleDetailPage } from "../pages/VehicleDetailPage";
import { EditVehiclePage } from "../pages/EditVehiclePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/garage",
            element: <GaragePage />,
          },
          {
            path: "/garage/new",
            element: <AddVehiclePage />,
          },
          {
            path: "/garage/:vehicleId",
            element: <VehicleDetailPage />,
          },
          {
            path: "/garage/:vehicleId/edit",
            element: <EditVehiclePage />,
          },
          {
            path: "/maintenance",
            element: <MaintenancePage />,
          },
          {
            path: "/builds",
            element: <BuildsPage />,
          },
          {
            path: "/expenses",
            element: <ExpensesPage />,
          },
          {
            path: "/analytics",
            element: <AnalyticsPage />,
          },
        ],
      },
    ],
  },
]);
