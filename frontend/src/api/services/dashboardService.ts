import { api } from "../baseApi";

export const dashboardService = {
  getSummary: async (month: number, year: number): Promise<any> => {
    const response = await api.get("/dashboard/summary", {
      params: { month, year },
    });
    return response.data;
  },
};
