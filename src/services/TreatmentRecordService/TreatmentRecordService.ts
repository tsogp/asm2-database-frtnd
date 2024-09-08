import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { DefaultPaginationRequest } from "../DefaultInterfaces";
import { AddTreatmentReq, AddTreatmentRes, MyTreatmentRes, TreatmentByAppointmentReq, TreatmentByAppointmentRes, TreatmentByIdReq, TreatmentByIdRes, TreatmentRecordFinishReq, TreatmentRecordFinishRes } from "./interfaces";
import dayjs from "dayjs";

class TreatRecordService {
  private requestService: RequestServiceType;
  private prefix: string;

  constructor() {
    this.requestService = requestService;
    this.prefix = "/treatment_record";
  }

  public async getMyTreatmentRecords(
    query : DefaultPaginationRequest,
    onFailure: (errMsg: string) => void
  ): Promise<MyTreatmentRes> {
    try {
      const queries = query;
      const res =
        await this.requestService.getWithAuth<MyTreatmentRes>(
          `${this.prefix}/my`,
          {params: queries}
        );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async getTreatmentRecordByAppointment(
    params : TreatmentByAppointmentReq, 
    query : DefaultPaginationRequest,
    onFailure: (errMsg: string) => void
  ): Promise<TreatmentByAppointmentRes> {
    try {
      const queries = query;
      const res =
        await this.requestService.getWithAuth<TreatmentByAppointmentRes>(
          `${this.prefix}/appointment/${params.id}`,
          {params: queries}
        );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async getTreatmentRecordByPatient(
    params : TreatmentByAppointmentReq, 
    query : DefaultPaginationRequest,
    onFailure: (errMsg: string) => void
  ): Promise<TreatmentByAppointmentRes> {
    try {
      const queries = query;
      const res =
        await this.requestService.getWithAuth<TreatmentByAppointmentRes>(
          `${this.prefix}/patient/${params.id}`,
          {params: queries}
        );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async getTreatmentRecordById(
    params : TreatmentByIdReq,
    onFailure: (errMsg: string) => void
  ): Promise<TreatmentByIdRes> {
    try {
      const res =
        await this.requestService.getWithAuth<TreatmentByIdRes>(
          `${this.prefix}/${params.id}`
        );

      return res?.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async addTreatmentRecord(
    req : AddTreatmentReq, 
    onSuccess: () => void,
    onFailure: (errMsg: string) => void
  ): Promise<AddTreatmentRes> {
    try {
      const date = req.treatment_date;
      if (!dayjs(date).isValid()) {
        throw new Error("Invalid date");
      }
      
      const res =
        await this.requestService.postWithAuth<AddTreatmentRes>(
          `${this.prefix}/new`, req
        );

      onSuccess();
      return res.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
  
  public async markTreatmentRecordAsFinished(
    params : TreatmentRecordFinishReq,
    onSuccess: () => void,
    onFailure: (errMsg: string) => void
  ): Promise<TreatmentRecordFinishRes> {
    try {
      const res =
        await this.requestService.putWithAuth<TreatmentRecordFinishRes>(
          `${this.prefix}/finish/${params.id}`
        );

      onSuccess();
      return res.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }

  public async markTreatmentRecordAsMissing(
    params : TreatmentRecordFinishReq,
    onSuccess: () => void,
    onFailure: (errMsg: string) => void
  ): Promise<TreatmentRecordFinishRes> {
    try {
      const res =
        await this.requestService.putWithAuth<TreatmentRecordFinishRes>(
          `${this.prefix}/missing/${params.id}`
        );

      onSuccess();
      return res.data;
    } catch (err) {
      onFailure(((err as AxiosError).response?.data as any).error);
      throw err;
    }
  }
}

const treatmentRecordService = new TreatRecordService();

export default treatmentRecordService;
