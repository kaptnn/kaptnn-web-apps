/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "axios";

export interface ArithmeticResponse {
  operation: string;
  num1: number;
  num2: number;
  result: number;
}

export interface DepreciationResponseStraight {
  metode: "straight_line";
  biaya_per_bulan: number;
  biaya_per_tahun: number;
}

export interface DepreciationResponseDouble {
  metode: "double_declining";
  biaya_per_bulan: number[];
  biaya_per_tahun: number[];
}

export type DepreciationResponse =
  | DepreciationResponseStraight
  | DepreciationResponseDouble;

export interface PresentValueResponse {
  present_value: number;
}

export interface WeightedAverageResponse {
  normal_average: number;
  weighted_average: number;
  weight_difference: number;
}

class CalculatorService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public depreciation = async (
    harga_perolehan: number,
    estimasi_umur: number,
    estimasi_nilai_sisa: number = 0,
    metode: "straight_line" | "double_declining" = "straight_line",
    token?: string,
    signal?: AbortSignal,
  ): Promise<DepreciationResponse> => {
    if (!["straight_line", "double_declining"].includes(metode)) {
      return Promise.reject(
        new Error("Invalid method: choose 'straight_line' or 'double_declining'."),
      );
    }

    try {
      const response = await this.axiosInstance.get("/v1/calculator/depreciation", {
        params: {
          harga_perolehan,
          estimasi_umur,
          estimasi_nilai_sisa,
          metode,
        },
        headers: this.getAuthHeaders(token),
        signal,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching result of depreciation calculation:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch result of depreciation calculation `;
      throw new Error(msg);
    }
  };

  public presentValue = async (
    future_value: number,
    rate: number,
    period: number = 0,
    token?: string,
    signal?: AbortSignal,
  ): Promise<PresentValueResponse> => {
    try {
      const response = await this.axiosInstance.get("/v1/calculator/present-value", {
        params: {
          future_value,
          rate,
          period,
        },
        headers: this.getAuthHeaders(token),
        signal,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching result of present value calculation:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch result of present value calculation `;
      throw new Error(msg);
    }
  };

  public weightedAverage = async (
    n_total: number,
    loss_rate_array: number[],
    weight_array: number[],
    token?: string,
    signal?: AbortSignal,
  ): Promise<WeightedAverageResponse> => {
    if (loss_rate_array.length !== n_total || weight_array.length !== n_total) {
      return Promise.reject(
        new Error("Length of loss_rate_array and weight_array must match n_total."),
      );
    }

    try {
      const response = await this.axiosInstance.get("/v1/calculator/weighted-average", {
        params: {
          n_total,
          loss_rate_array,
          weight_array,
        },
        headers: this.getAuthHeaders(token),
        signal,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching result of weighted average calculation:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch result of weigted average calculation `;
      throw new Error(msg);
    }
  };
}

export default CalculatorService;
