import { fetchWithAuth } from "@/common/utils";

export interface DashboardRevenueResponse {
  month: number;
  revenue: number;
  orderCount: number;
}

export interface DashboardResponse {
  orders: {
    count: number;
    percentage: number;
    trend: "UP" | "DOWN" | "SAME";
  };
  pendingPayments: {
    count: number;
    percentage: number;
    trend: "UP" | "DOWN" | "SAME";
  };
  inventoryValue: number;
  revenue: {
    value: number;
    percentage: number;
    trend: "UP" | "DOWN" | "SAME";
  };
}

export interface GetRevenueQueyDto {
    year?: string
}

export const getDashboardData = async(): Promise<DashboardResponse> => {
    return await fetchWithAuth('dashboard')
}

export const getRevenueData = async(query?: GetRevenueQueyDto): Promise<DashboardRevenueResponse[]> => {
    return await fetchWithAuth('dashboard/revenue-details',{query})
}