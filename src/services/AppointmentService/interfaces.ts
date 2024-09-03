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
  status: string;
}

export interface Treatment {
  id: number,
  name: string,
  date: Dayjs,
}

export interface AppointmentRequest {
  status?: string; 
  page: number;
  limit: number;
}

export interface CancelAppointmentRequest {
  patient_id: number;
  appointment_id: number;
}

export interface AppointmentResponse {
  results: Appointment[];
  pagination: DefaultPagination;
}