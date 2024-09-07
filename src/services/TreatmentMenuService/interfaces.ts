import { DefaultPagination } from "../DefaultInterfaces";

export interface TreatmentMenu {
  treatment_id: number;
  treatment_name: string;
  treatment_cost: string;
}

export interface GetAllTreatmentMenusRes {
  results: TreatmentMenu[];
}

export interface GetTreatmentMenuByIdReq {
  id: number;
}

export interface GetTreatmentMenuByIdRes extends TreatmentMenu {}

export interface AddTreatmentMenuReq {
  treatment_name: string;
  treatment_cost: number;
}

export interface AddTreatmentMenuRes {
  message: string;
}

export interface UpdateTreatmentMenuReq {
  treatment_id: number;
  treatment_name: string;
  treatment_cost: string;
}

export interface UpdateTreatmentMenuRes {
  message: string;
}