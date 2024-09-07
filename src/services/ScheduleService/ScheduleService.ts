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
  // GET
  // public async getAllDepartments(onFailure: (errorMsg: string) => void): Promise<AppointmentResponse> {
  //   try {
  //     const response =
  //       await this.requestService.getWithAuth<Department[]>(
  //         '/department/all',
  //       );

  //     return response?.data ?? [];
  //   } catch (error) {
  //     onFailure(((error as AxiosError).response?.data as any).error)
  //     throw(error);
  //   }
  // }

  // POST
  // public async cancelAppointment(request: CancelAppointmentRequest, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
  //   try {
  //     const response =
  //       await this.requestService.putWithAuth<void>(
  //         '/appointment/cancel', request
  //       );

  //     onSuccess();
  //   } catch (error) {
  //     onFailure(((error as AxiosError).response?.data as any).error)
  //     throw(error);
  //   }
  // }
}

const scheduleService = new ScheduleService();

export default scheduleService;
