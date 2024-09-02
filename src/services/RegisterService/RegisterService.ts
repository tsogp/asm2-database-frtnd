import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";

class RegisterService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async registerPatient(email: string, password: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response = await this.requestService.postWithAuth<void>('/auth/patient/new', 
        {
          email,
          password,
        }
      );
      
      onSuccess();
    } catch (error) {
      console.log(error)
      onFailure(((error as AxiosError).response?.data as any).error);
    }
  }

  public async registerStaff(email: string, password: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response = await this.requestService.postWithAuth<void>('/auth/staff/new', 
        {
          email,
          password,
        }
      );

      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
    }
  }
}

const registerService = new RegisterService();

export default registerService;
