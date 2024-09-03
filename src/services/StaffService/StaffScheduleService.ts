import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { StaffScheduleRequest } from "./interfaces";

class StaffScheduleService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async getStaffSchedule(request: StaffScheduleRequest, onFailure: (errorMsg: string) => void) {
    try {
      const params = request;

      const response =  
        await this.requestService.getWithAuth<void>(
          '/schedule/staff', 
          { params }
        );

      console.log(response);

      return response?.data ?? [];
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
}

const staffScheduleService = new StaffScheduleService();

export default staffScheduleService;
