import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ExpensePage from "@/features/expenses/ExpensePage";
import CategoryPage from "@/features/categories/CategoryPage";
import BudgetPage from "@/features/budgets/BudgetPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "expenses", element: <ExpensePage /> },
      { path: "categories", element: <CategoryPage /> },
      { path: "budgets", element: <BudgetPage /> },
    ],
  },
]);
