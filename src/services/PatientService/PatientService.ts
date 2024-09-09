import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { DefaultPaginationRequest } from "../DefaultInterfaces";
import { GetAllPatientRes, GetAllPatientReq, GetScheduleRes, ScheduleByStaffIdReq, ScheduleByStaffIdRes } from "./interfaces";

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
      
      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async deletePatient(id: number, onSuccess: () => void, onFailure: (errMsg: string) => void): Promise<void> {
    try {
      await this.requestService.deleteWithAuth<void>(
        `${this.prefix}`, { params: { id } }
      );

      onSuccess();
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
}

const patientService = new PatientService();

export default patientService;
