import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./api/router/AppRouter.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* React Query's cache provider */}
      <RouterProvider router={router} />{" "}
      {/* React Router's provider for routing */}
    </QueryClientProvider>
  </StrictMode>,
);
