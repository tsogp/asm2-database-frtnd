import { DefaultPagination } from "../DefaultInterfaces";

export interface Department {
  department_id: number,
  department_name: string,
}

export interface DoctorsByDepartmentRequest {
  department_id: number;
  page: number;
  limit: number;
}

export interface DoctorsByDepartmentResponse {
  results: Doctor[];
  pagination: DefaultPagination
}

export interface Doctor {
  staff_id: number,
  first_name: string,
  last_name: string,
  department_name: string,
  job_type: string,
}