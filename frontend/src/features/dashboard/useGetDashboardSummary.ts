import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { dashboardService } from "./dashboardService";
import type { Dashboard } from "./dashboard.types";

export const useDashboardSummary = (month: number, year: number) => {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(month, year),
    queryFn: async ({ queryKey: [, , month, year] }): Promise<Dashboard> => {
      const response = await dashboardService.getSummary(month, year);
      return response;
    },
  });
};
