import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { AppointmentRequest, AppointmentResponse, CancelAppointmentRequest } from "@/src/services/AppointmentService/interfaces";

class AppointmentService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async getPatientsAppointments(request: AppointmentRequest, onFailure: (errorMsg: string) => void): Promise<AppointmentResponse> {
    try {
      const params = request;

      const response =  
        await this.requestService.getWithAuth<AppointmentResponse>(
          '/appointment/my', 
          { params }
        );

      return response?.data ?? [];
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async cancelAppointment(request: CancelAppointmentRequest, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response =  
        await this.requestService.putWithAuth<void>(
          '/appointment/cancel', request
        );
      
      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
}

const appointmentService = new AppointmentService();

export default appointmentService;
