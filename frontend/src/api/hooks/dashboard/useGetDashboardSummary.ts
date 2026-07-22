import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../types/queryKeys";
import { dashboardService } from "../../services/dashboardService";
import type { Dashboard } from "../../types/Dashboard";

export const useDashboardSummary = (month: number, year: number) => {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(month, year),
    queryFn: async ({ queryKey: [, , month, year] }): Promise<Dashboard> => {
      const response = await dashboardService.getSummary(month, year);
      return response;
    },
  });
};
