import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";

export interface TicketReport {
  staff_id: number;
  staff_first_name: string;
  staff_last_name: string;
  staff_email: string;
  staff_gender: string;
  staff_salary: number;
  staff_job_type: string;
  staff_department_name: string;
  staff_manager: number;
  ticket_id: number;
  created_date: string;
  ticket_note: string;
  ticket_status: string;
  ticket_first_name: string;
  ticket_last_name: string;
  ticket_gender: string;
  ticket_job_type: string;
  ticket_department_name: string;
  ticket_manager: number;
}

export interface AllTicketResponse {
  results: TicketReport[];
  pagination: DefaultPagination;
}

export interface MyTicketsResponse extends AllTicketResponse {}

export interface Ticket {
  newFirstName: string;
  newLastName: string;
  newGender: string;
  newManagerId: number;
  newSalary: number;
  newJobType: string;
  newDepartmentID: number;
  notes: string;
}

export interface NewTicketBody extends Ticket {}

export interface NewTicketResponse {
  message: string;
}

export interface ApproveTicketParam {
  ticket_id: number;
}

export interface ApproveTicketResponse {
  message: string;
}

export interface RejectTicketParam extends ApproveTicketParam {}

export interface RejectTicketBody {
  note: string;
}

export interface RejectTicketResponse extends ApproveTicketResponse {}

export interface UpdateTicketParam extends ApproveTicketParam {}

export interface UpdateTicketBody extends Ticket {}

export interface UpdateTicketResponse {
  message: string;
}

export interface DeleteTicketParam extends ApproveTicketParam {}

export interface DeleteTicketResponse extends ApproveTicketResponse {}