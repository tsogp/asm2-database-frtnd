import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { AppointmentRequest, AppointmentResponse } from "@/src/services/AppointmentService/interfaces";

class AppointmentService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async getPatientsAppointments(request: AppointmentRequest, onFailure: (errorMsg: string) => void): Promise<AppointmentResponse | undefined> {
    try {
      const params = request;

      const response =  
        await this.requestService.getWithAuth<AppointmentResponse>(
          '/appointment/my', 
          { params }
        );

      return response.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
    }
  }
}

const appointmentService = new AppointmentService();

export default appointmentService;
