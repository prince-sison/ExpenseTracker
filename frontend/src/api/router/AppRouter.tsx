import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../../components/features/dashboard/DashboardPage";
import Layout from "../../components/shared/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "expenses", element: <div>Expenses Page</div> },
      { path: "categories", element: <div>Categories Page</div> },
      { path: "budgets", element: <div>Budgets Page</div> },
    ],
  },
]);
