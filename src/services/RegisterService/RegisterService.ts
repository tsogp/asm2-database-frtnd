import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";

class RegisterService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async registerPatient(email: string, password: string, first_name: string, last_name: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response = await this.requestService.postWithAuth<void>('/auth/patient/new', 
        {
          email,
          password,
          f_name: first_name,
          l_name: last_name,     
        }
      );
      
      onSuccess();
    } catch (error) {
      console.log(error)
      onFailure(((error as AxiosError).response?.data as any).error);
    }
  }

  public async registerStaff(email: string, password: string, first_name: string, last_name: string, job_type: string, gender: string, department_id: number, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response = await this.requestService.postWithAuth<void>('/auth/staff/new', 
        {
          email,
          password,
          f_name: first_name,
          l_name: last_name,
          job_type,
          gender,
          department_id,
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
