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

export interface GetAllPatientRes {
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

export interface UpdateMyInfoReq {
  newFirstName: string;
  newLastName: string;
  newGender: string;
  newDOB: string;
}

export interface UpdateMyInfoRes {
  results: string;
}

export interface Schedule {
  staff_id: number;
  schedule_date: Dayjs;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  job_type: string;
  department_name: string;
}

export interface GetScheduleRes {
  results: Schedule[];
  pagination: DefaultPagination;
}

export interface ScheduleByStaffIdReq {
  id: number;
}

export interface ScheduleByStaffIdRes {
  results: Schedule[];
  pagination: DefaultPagination;
}

export interface FreeSchedule {
  staff_id: 2;
  staff_first_name: string;
  staff_last_name: string;
  schedule_date: Dayjs;
  "09:00-10:00": string;
  "10:00-11:00": string;
  "11:00-12:00": string;
  "12:00-13:00": string;
  "13:00-14:00": string;
  "14:00-15:00": string;
  "15:00-16:00": string;
  "16:00-17:00": string;
}

export interface FreeScheduleRes {
  results: FreeSchedule[];
  pagination: DefaultPagination;
}
