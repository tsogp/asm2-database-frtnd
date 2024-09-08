import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { AllAppointmentsRes, AppointmentByPatientIdParams, AppointmentByPatientIdQueries, AppointmentByPatientIdRes, AppointmentRequest, AppointmentResponse, BookAppointmentReq, BookAppointmentRes, CancelAppointmentRequest, FinishAppointmentBody, FinishAppointmentRes, StaffAppointmentRequest, StaffAppointmentResponse, UpdateAppointmentReq, UpdateAppointmentRes } from "@/src/services/AppointmentService/interfaces";
import { DefaultPagination, DefaultPaginationRequest } from "../DefaultInterfaces";
import dayjs from "dayjs";

class AppointmentService {
  private requestService: RequestServiceType;
  private prefix : string;

  constructor() {
    this.prefix = '/appointment';
    this.requestService = requestService;
  }

  public async getPatientsAppointments(request: AppointmentRequest, onFailure: (errorMsg: string) => void): Promise<AppointmentResponse> {
    try {
      const params = request;

      const response =  
        await this.requestService.getWithAuth<AppointmentResponse>(
          '/appointment/patient/my', 
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
  
  // NEW THINGY
  public async getAllAppointments(query : DefaultPaginationRequest, onFailure: (errorMsg: string) => void): Promise<AllAppointmentsRes> {
    try {
      const params = query;

      const response =  
        await this.requestService.getWithAuth<AllAppointmentsRes>(
          '/appointment/all', 
          { params }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
  
  public async getAppointmentsByPatientId(params: AppointmentByPatientIdParams, queries: AppointmentByPatientIdQueries, onFailure: (errorMsg: string) => void): Promise<AppointmentByPatientIdRes> {
    try {
      const response =  
        await this.requestService.getWithAuth<AppointmentByPatientIdRes>(
          `/appointment/patient/${params.id}`, 
          { params: queries }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
  
  public async bookAppointment(req: BookAppointmentReq, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<BookAppointmentRes> {
    try {
      const date = req.date;
      if (!dayjs(date).isValid()) {
        throw new Error("Invalid date");
      }
      
      const response =  
        await this.requestService.postWithAuth<BookAppointmentRes>(
          '/appointment/new', req
        );
      
      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async updateAppointment(req: UpdateAppointmentReq, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<UpdateAppointmentRes> {
    try {
      const date = req.date;
      if (!dayjs(date).isValid()) {
        throw new Error("Invalid date");
      }
      
      const response =  
        await this.requestService.putWithAuth<UpdateAppointmentRes>(
          `${this.prefix}`, req
        );
      
      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
  
  public async finishAppointment(req: FinishAppointmentBody, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<FinishAppointmentRes> {
    try {
      const response =  
        await this.requestService.putWithAuth<FinishAppointmentRes>(
          '/appointment/finish', req
        );
      
      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async getStaffAppointments(request: StaffAppointmentRequest, onFailure: (errorMsg: string) => void): Promise<StaffAppointmentResponse> {
    try {
      const params = request;

      const response =  
        await this.requestService.getWithAuth<StaffAppointmentResponse>(
          '/appointment/doctor/my', 
          { params }
        );

      return response.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
}

const appointmentService = new AppointmentService();

export default appointmentService;
