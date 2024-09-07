export interface UserResponse {
  patient_id: number,
  first_name: string,
  last_name: string,
  email: string,
  date_of_birth: Date,
  gender: string,
  role: string;
  allergies: string,
}

export interface StaffResponse {
  staff_id: number,
  first_name: string,
  last_name: string,
  email: string,
  gender: string,
  job_type: string,
  salary: number,
  department_id: number,
  department_name: string,
  manager_id: number,
  role: string;
  imgSrc: string;
  imgExt: string;
}

export interface UpdateUserRequest {
  newFirstName?: string,
  newLastName?: string,
  newDOB?: string,
  newGender?: string,
  newAllergies?: string;
}

export interface LoginResponse {
  message: string,
  role: string,
}