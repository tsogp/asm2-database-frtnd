import { Dayjs } from "dayjs";
import { DefaultPagination } from "../DefaultInterfaces";

export interface Appointment {
  appointment_id: number;
  department_name: string;
  job_type: string;
  schedule_date: Dayjs;
  slot_number: number;
  staff_first_name: string;
  staff_last_name: string; 
  staff_id: number;
  treatments: string;
  purpose: string;
}

export interface AppointmentRequest {
  status?: string; 
  page: number;
  limit: number;
}

export interface AppointmentResponse {
  results: Appointment[];
  pagination: DefaultPagination;
}