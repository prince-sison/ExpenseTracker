import { baseApiProvider as api } from "../baseApi";
import { buildPath, Routes } from "../types/routes";
import type { Dashboard } from "../types/Dashboard";

export const dashboardService = {
  getSummary: async (month: number, year: number): Promise<Dashboard> => {
    const url = buildPath(Routes.getDashboardSummary);
    const response = await api.get(url, {
      params: { month, year },
    });
    return response.data;
  },
};
