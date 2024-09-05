export interface UserResponse {
  staff_id: number,
  allergies: string,
  date_of_birth: string,
  email: string,
  first_name: string,
  gender: string, 
  last_name: string,
  patient_id: number,
}

export interface UpdateUserRequest {
  newFirstName?: string,
  newLastName?: string,
  newDOB?: string,
  newGender?: string,
  newAllergies?: string;
}

export interface IUser extends UserResponse {
  role: string;
}