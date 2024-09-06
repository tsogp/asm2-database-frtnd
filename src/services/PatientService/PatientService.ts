import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { DefaultPaginationRequest } from "../DefaultInterfaces";
import { GetAllPatientRes, GetAllPatientReq } from "./interfaces";

class PatientService {
  private requestService: RequestServiceType;
  private prefix: string;

  constructor() {
    this.requestService = requestService;
    this.prefix = "/patient";
  }

  public async getAllPatients(req: GetAllPatientReq, onFailure: (errMsg: string) => void): Promise<GetAllPatientRes> {
    try {
      const params = req;
      const res = await this.requestService.getWithAuth<GetAllPatientRes>(
        `${this.prefix}/all`,
        { params }
      );
      
      console.log(res?.data);
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

const patientService = new PatientService();

export default patientService;
