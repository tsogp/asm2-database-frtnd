import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";

export interface StaffScheduleRequest {
  staff_id: number;
}

export interface Staff {
  staff_id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  job_type: string;
  department_id: number | null;
  department_name: string | null;
  manager_id: number | null;
}

export interface GetAllStaffReq extends DefaultPaginationRequest {
  job_type: string;
  department: number;
}

export interface GetAllStaffRes {
  results: Staff[];
  pagination: DefaultPagination;
}

export interface Doctor {
  first_name: string;
  last_name: string;
  department_name: string;
}

export interface GetAllDoctorsReq extends DefaultPaginationRequest {}

export interface GetAllDoctorsRes {
  results: Doctor[];
  pagination: DefaultPagination;
}

export interface GetMyInfoReq {}

export interface GetMyInfoRes extends Staff {}

export interface GetStaffByIdReq {
  id: number;
}

export interface GetStaffByIdRes extends Staff {}

export interface UpdateMyInfoReq {
  firstName: string;
  lastName: string;
  gender: string;
  job_type: string;
  departmentId: number;
  salary: number;
}

export interface UpdateMyInfoRes {
  message : string
}
