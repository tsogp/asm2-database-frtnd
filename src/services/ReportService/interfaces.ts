import { Appointment } from "../AppointmentService/interfaces";
import { Treatment } from "../TreatmentRecordService/interfaces";

export interface GetPatientTreatmentRecordQuery {
  start_date: string;
  end_date: string;
  email: string;
}

export interface GetPatientTreatmentRecordResponse {
  message: string;
  results: Treatment[];
}

export interface GetStaffHistoryQuery extends GetPatientTreatmentRecordQuery {}

export interface GetStaffHistoryResponse
  extends GetPatientTreatmentRecordResponse {}

export interface GetStaffJobChangeQuery
  extends GetPatientTreatmentRecordQuery {}

export interface GetBillingParams {
  appointment_id: number;
}

export interface GetBillingRes extends Appointment {
  total_cost: number;
}
