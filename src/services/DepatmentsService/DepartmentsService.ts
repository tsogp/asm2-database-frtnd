import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { AppointmentRequest, AppointmentResponse, CancelAppointmentRequest } from "@/src/services/DepartmentService/interfaces";
import { Department, DoctorsByDepartmentRequest, DoctorsByDepartmentResponse } from "./interfaces";
import { DefaultPaginationRequest } from "../DefaultInterfaces";

class DepartmentService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async getAllDepartments(onFailure: (errorMsg: string) => void): Promise<AppointmentResponse> {
    try {
      const response =  
        await this.requestService.getWithAuth<Department[]>(
          '/department/all', 
        );

      return response?.data ?? [];
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async getAllDoctorsByDepartment(request: DoctorsByDepartmentRequest, onFailure: (errorMsg: string) => void): Promise<DoctorsByDepartmentResponse> {
    const params = request;

    try {
      const response =  
        await this.requestService.getWithAuth<DoctorsByDepartmentResponse>(
          `/department/doctor/${params.department_id}`,
        );
      
        console.log(response);

      return response.data ?? [];
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async getAllDoctors(request: DefaultPaginationRequest, onFailure: (errorMsg: string) => void): Promise<DoctorsByDepartmentResponse> {
    const params = request;

    try {
      const response =  
        await this.requestService.getWithAuth<DoctorsByDepartmentResponse>(
          '/staff/doctor', { params }
        );
      
      return response.data ?? [];
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
}

const departmentService = new DepartmentService();

export default departmentService;
