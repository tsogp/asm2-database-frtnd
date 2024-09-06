import { Dayjs } from "dayjs";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";

export interface ScheduleAll {
  staff_id: number;
  schedule_date: Dayjs;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  job_type: string;
  department_name: string;
}

export interface GetAllRequest extends DefaultPaginationRequest {}

export interface GetAllReponse {
  results: ScheduleAll[];
  pagination: DefaultPagination;
}

export interface StaffSchedule {
  schedule_id: number;
  staff_id: number;
  schedule_date: Dayjs;
}

export interface GetStaffScheduleRequest {
  results: StaffSchedule[];
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

export interface GetFreeSchedule {
  results: FreeSchedule[];
  pagination: DefaultPagination;
}
