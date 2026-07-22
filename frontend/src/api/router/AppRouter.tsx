import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../../components/features/dashboard/DashboardPage";
import Layout from "../../components/shared/Layout";
import ExpensePage from "../../components/features/expenses/ExpensePage";
import CategoryPage from "../../components/features/categories/CategoryPage";
import BudgetPage from "../../components/features/budgets/BudgetPage";

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
