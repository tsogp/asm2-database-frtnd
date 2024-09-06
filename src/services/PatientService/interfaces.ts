import { Dayjs } from "dayjs";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";

export interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: Dayjs;
  gender: string;
  allergies: string;
}

export interface GetAllPatientReq extends DefaultPaginationRequest {}

export interface GetALlPatientRes {
  results: Patient[];
  pagination: DefaultPagination;
}

export interface GetMyInfoRes extends Patient {}

export interface GetPatientById {
  id: number;
}

export interface GetPatientByNameReq {
  first_name: string;
  last_name: string;
}

export interface GetPatientByNameRes {
  results: Patient[];
}
