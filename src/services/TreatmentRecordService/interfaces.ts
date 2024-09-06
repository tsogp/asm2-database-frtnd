import { Dayjs } from "dayjs";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";

export interface Treatment {
  appointment_id: number;
  patient_id: number;
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  treatment_status: string;
  staff_first_name: string;
  staff_last_name: string;
  job_type: string;
  department_name: string;
  treatment_id: number;
  treatment_name: string;
  treatment_date: Dayjs;
  treatment_cost: number;
}

export interface MyTreatmentRes {
  results: Treatment[];
  pagination: DefaultPagination;
}

export interface TreatmentByAppointmentReq {
  id: number;
}

export interface TreatmentByAppointmentRes {
  results: Treatment[];
  pagination: DefaultPagination;
}

export interface TreatmentByPatientReq {
  id: number;
}

export interface TreatmentByPatientRes {
  results: Treatment[];
  pagination: DefaultPagination;
}

export interface Treatment2 {
  treatment_id: number;
  appointment_id: number;
  treatment_date: Dayjs;
  status: string;
  record_id: number;
}

export interface TreatmentByIdReq {
  id: number;
}

export interface TreatmentByIdRes {
  result: Treatment2;
}

export interface Treatment3 {
  treatment_id: number;
  treatment_date: string;
  appointment_id: number;
}

export interface AddTreatmentReq extends Treatment3 {}

export interface AddTreatmentRes {
  message: string;
}

export interface TreatmentRecordFinishReq {
  id: number;
}

export interface TreatmentRecordFinishRes {
  message: string;
}