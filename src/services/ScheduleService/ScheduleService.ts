import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";
import {
  FreeScheduleRes,
  GetScheduleRes,
  ScheduleByStaffIdReq,
  ScheduleByStaffIdRes,
} from "../PatientService/interfaces";
import { GetFreeSchedule } from "./interfaces";

class ScheduleService {
  private requestService: RequestServiceType;
  private prefix: string;

  constructor() {
    this.requestService = requestService;
    this.prefix = "/schedule";
  }

  public async getAllSchedule(
    query: DefaultPaginationRequest,
    onFailure: (errMsg: string) => void
  ): Promise<GetScheduleRes> {
    try {
      const res = await this.requestService.getWithAuth<any>(
        `${this.prefix}/all`,
        { params: query }
      );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }

  public async getScheduleByStaff(
    params: ScheduleByStaffIdReq,
    onFailure: (errMsg: string) => void
  ): Promise<ScheduleByStaffIdRes> {
    try {
      const res = await this.requestService.getWithAuth<ScheduleByStaffIdRes>(
        `${this.prefix}/staff/${params.id}`,
        { params }
      );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }

  public async getFreeSchedule(
    query: DefaultPaginationRequest,
    onFailure: (errMsg: string) => void
  ): Promise<FreeScheduleRes> {
    try {
      const res = await this.requestService.getWithAuth<FreeScheduleRes>(
        `${this.prefix}/doctor`,
        { params: query }
      );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }

  public async getFreeScheduleById(
    id: number,
    onFailure: (errMsg: string) => void
  ): Promise<GetFreeSchedule> {
    try {
      const res = await this.requestService.getWithAuth<GetFreeSchedule>(
        `${this.prefix}/doctor/${id}`
      );

      return res.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
}

const scheduleService = new ScheduleService();

export default scheduleService;
