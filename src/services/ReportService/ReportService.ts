import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";
import dayjs from "dayjs";
import {
  GetBillingParams,
  GetBillingRes,
  GetPatientTreatmentRecordQuery,
  GetPatientTreatmentRecordResponse,
  GetStaffHistoryQuery,
  GetStaffHistoryResponse,
} from "./interfaces";

class ReportService {
  private requestService: RequestServiceType;
  private prefix: string;

  constructor() {
    this.prefix = "/report";
    this.requestService = requestService;
  }

  public async getPatientTreatmentRecordReport(
    query: GetPatientTreatmentRecordQuery,
    onFailure: (errorMsg: string) => void
  ): Promise<GetPatientTreatmentRecordResponse> {
    try {
      if (!dayjs(query.start_date).isValid() || !dayjs(query.end_date).isValid()) {
        throw new Error("Invalid date format");
      }
      
      const response =
        await this.requestService.getWithAuth<GetPatientTreatmentRecordResponse>(
          "/report/patient",
          { params : query }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async getStaffHistory(
    query: GetStaffHistoryQuery,
    onFailure: (errorMsg: string) => void
  ): Promise<GetStaffHistoryResponse> {
    try {
      const params = query;

      const response =
        await this.requestService.getWithAuth<GetStaffHistoryResponse>(
          "/report/staff/work",
          { params }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async getStaffJobChange(
    query: GetStaffHistoryQuery,
    onFailure: (errorMsg: string) => void
  ): Promise<GetStaffHistoryResponse> {
    try {
      const params = query;

      const response =
        await this.requestService.getWithAuth<GetStaffHistoryResponse>(
          "/report/staff/job_changes",
          { params }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }
  
  public async getBilling(
    params: GetBillingParams,
    onFailure: (errorMsg: string) => void
  ): Promise<GetBillingRes> {
    try {
      const response = await this.requestService.getWithAuth<GetBillingRes>(
        `/report/billing/${params.appointment_id}`
      );
      
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }
}

const reportService = new ReportService();

export default reportService;