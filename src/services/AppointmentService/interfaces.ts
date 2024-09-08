import { Dayjs } from "dayjs";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";

export interface Appointment {
  appointment_id: number;
  department_name: string;
  job_type: string;
  schedule_date: Dayjs;
  slot_number: number;
  staff_first_name: string;
  staff_last_name: string;
  staff_id: number;
  purpose: string;
  status: string;
}

export interface Treatment {
  id: number;
  name: string;
  date: Dayjs;
}

export interface AppointmentRequest {
  status?: string;
  page: number;
  limit: number;
}

export interface StaffAppointmentRequest extends DefaultPaginationRequest {
  role: string;
  id: number;
}

export interface StaffAppointment {
  appointment_id: number; 
  patient_first_name: string; 
  patient_last_name: string;
  purpose: string;
  schedule_date: Dayjs;
  slot_number: number;
  status: string;
};

export interface StaffAppointmentResponse {
  results: StaffAppointment[];
  pagination: DefaultPagination;
}

export interface CancelAppointmentRequest {
  patient_id: number;
  appointment_id: number;
}

export interface AppointmentResponse {
  results: Appointment[];
  pagination: DefaultPagination;
}

// new interfaces
export interface AllAppointmentsRes {
  results: Appointment[];
  pagination: DefaultPagination;
}

export interface AppointmentByPatientIdParams {
  id: number;
}

export interface AppointmentByPatientIdQueries
  extends DefaultPaginationRequest {
  status: string;
}

export interface AppointmentByPatientIdRes {
  results: Appointment[];
  pagination: DefaultPagination;
}

export interface BookAppointmentReq {
  patientID: number;
  doctorID: number;
  date: string;
  slotNumber: number;
  purpose: string;
}

export interface BookAppointmentRes {
  message: string;
}

export interface UpdateAppointmentReq {
  appointmentId: number;
  date: string;
  timeSlot: number;
}

export interface UpdateAppointmentRes {
  message: string;
}

export interface FinishAppointmentBody {
  appointment_id: number; 
}

export interface FinishAppointmentRes {
  message: string;
}