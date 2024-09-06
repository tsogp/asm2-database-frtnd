import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { DefaultPaginationRequest } from "../DefaultInterfaces";
import { AddTreatmentMenuReq, AddTreatmentMenuRes, GetAllTreatmentMenusRes, GetTreatmentMenuByIdReq, GetTreatmentMenuByIdRes } from "./interfaces";

class TreatmentMenuService {
  private requestService: RequestServiceType;
  private prefix: string;

  constructor() {
    this.requestService = requestService;
    this.prefix = "/treatment";
  }

  public async getAllTreatmentMenus(
    onFailure: (errMsg: string) => void
  ): Promise<GetAllTreatmentMenusRes> {
    try {
      const res =
        await this.requestService.getWithAuth<GetAllTreatmentMenusRes>(
          `${this.prefix}/all`
        );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async getTreatmentMenuById(
    req : GetTreatmentMenuByIdReq,
    onFailure: (errMsg: string) => void
  ): Promise<GetTreatmentMenuByIdRes> {
    try {
      const params = req;
      const res =
        await this.requestService.getWithAuth<GetTreatmentMenuByIdRes>(
          `${this.prefix}/${params.id}`, 
          {params}
        );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async addTreatmentMenu(
    req : AddTreatmentMenuReq,
    onSuccess: () => void,
    onFailure: (errMsg: string) => void
  ): Promise<AddTreatmentMenuRes> {
    try {
      const res =
        await this.requestService.postWithAuth<AddTreatmentMenuRes>(
          `${this.prefix}/new`, req
        );

      onSuccess();
      return res.data;
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

const treatmentMenuService = new TreatmentMenuService();

export default treatmentMenuService;
