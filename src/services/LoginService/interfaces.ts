import { Dayjs } from "dayjs"

export interface UserResponse {
  staff_id: number,
  allergies: string[],
  date_of_birth: Dayjs,
  email: string,
  first_name: string,
  gender: string, 
  last_name: string,
  patient_id: number,
}

export interface IUser extends UserResponse {
  role: string;
}