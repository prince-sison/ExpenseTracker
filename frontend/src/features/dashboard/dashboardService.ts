import { baseApiProvider as api } from "@/shared/api/baseApi";
import { buildPath, Routes } from "@/shared/config/routes";
import type { Dashboard } from "./dashboard.types";

export const dashboardService = {
  getSummary: async (month: number, year: number): Promise<Dashboard> => {
    const url = buildPath(Routes.getDashboardSummary);
    const response = await api.get(url, {
      params: { month, year },
    });
    return response.data;
  },
};
