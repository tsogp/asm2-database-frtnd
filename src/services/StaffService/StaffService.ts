import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { GetAllStaffRes, StaffScheduleRequest } from "./interfaces";
import { DefaultPaginationRequest } from "../DefaultInterfaces";

class StaffService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  // public async getStaffSchedule(request: StaffScheduleRequest, onFailure: (errorMsg: string) => void) {
  //   try {
  //     const params = request;

  //     const response =  
  //       await this.requestService.getWithAuth<void>(
  //         '/schedule/staff', 
  //         { params }
  //       );

  //     console.log(response);

  //     return response.data ?? [];
  //   } catch (error) {
  //     onFailure(((error as AxiosError).response?.data as any).error)
  //     throw(error);
  //   }
  // }
  public async getAllStaffs(request: DefaultPaginationRequest, onFailure: (errorMsg: string) => void): Promise<GetAllStaffRes> {
    try {
      const params = request;

      const response =  
        await this.requestService.getWithAuth<GetAllStaffRes>(
          '/staff/all', 
          { params }
        );

      return response.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async deleteStaff(id: number, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      await this.requestService.deleteWithAuth<void>(
        `/staff/${id}`,
      );

      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
}

const staffService = new StaffService();

export default staffService;
