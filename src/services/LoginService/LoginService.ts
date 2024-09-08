import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { LoginResponse, StaffResponse, UpdateUserRequest, UserResponse } from "./interfaces";
import dayjs, { Dayjs, isDayjs } from "dayjs";
import router from "@/src/router";
import fileService from "../FileService/FileService";
import { Department } from "../DepatmentsService/interfaces";

class LoginService {
  private requestService: RequestServiceType;
  private user: UserResponse | StaffResponse;

  constructor() {
    this.requestService = requestService;
    this.user = localStorage.getItem('user') !== null
      // @ts-ignore
      ? JSON.parse(localStorage.getItem('user'))
      : null;
  }

  public async patientLogin(email: string, password: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const userData = await this.requestService.postWithAuth<LoginResponse>('/auth/login', 
        {
          email,
          password
        },
      );
      
      setTimeout(async () => {
        const response = await this.requestService.getWithAuth<UserResponse>('/patient/myInfo');

        this.user = {
          ...response.data,
          role: userData.data.role
        };
  
        localStorage.setItem('user', JSON.stringify(this.user));

        onSuccess();
      }, 200);
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async userUpdateData(request: UpdateUserRequest, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const userData = await this.requestService.putWithAuth<LoginResponse>('/patient', 
        request
      );

      const response = await this.requestService.getWithAuth<UserResponse>('/patient/myInfo');
      
      const role = loginService.getUserRole();

      this.user = {
        ...response.data,
        role: role ?? '',
      };

      localStorage.setItem('user', JSON.stringify(this.user));

      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  } 

  public async staffLogin(email: string, password: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const userData = await this.requestService.postWithAuth<LoginResponse>('/auth/login', 
        {
          email,
          password
        },
      );
      setTimeout(async () => {
        const response = await this.requestService.getWithAuth<StaffResponse>('/staff/my');

        const imgSrc = await fileService.getStaffAvatar(
          { mysql_id: response.data.staff_id },
          () => console.log(`failed fetching for ${response.data.staff_id}`));

        this.user = {
          ...response.data,
          role: userData.data.role,
          imgSrc: imgSrc.base64,
          imgExt: imgSrc.filename.split('.')[1]
        };  

        localStorage.setItem('user', JSON.stringify(this.user));

        onSuccess();
      }, 200);
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async getStaffInfo() {
    const response = await this.requestService.getWithAuth<StaffResponse>('/staff/my');

    const imgSrc = await fileService.getStaffAvatar(
      { mysql_id: response.data.staff_id },
      () => console.log(`failed fetching for ${response.data.staff_id}`));
    
    console.log(imgSrc)

    this.user = {
      ...response.data,
      role: 'staff',
      imgSrc: imgSrc.base64,
      imgExt: imgSrc.filename.split('.')[1]
    };  

    localStorage.setItem('user', JSON.stringify(this.user));
  }

  public async logout(onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response = await this.requestService.deleteWithAuth<null>('/auth/logout');

      this.cleanUser();

      router.push('/signup')
      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    return this.user !== null;
  }

  public cleanUser(): void {
    // @ts-ignore
    this.user = null;
    localStorage.removeItem('user');
  }

  public getUserFirstName(): string | null {
    return this.user?.first_name ?? null;
  }

  public getUserLastName(): string | null {
    return this.user?.last_name ?? null;
  }

  public getUserGender(): {code: string | null, name: string | null} {
    enum Gender {
      'M' = 'Male',
      'F' = 'Female',
      'O' = 'Other'
    }

    return { 
      code: this.user?.gender ?? null, 
      name: this.user?.gender ? Gender[this.user.gender as keyof typeof Gender] : null  
    };
  }

  public getUserEmail(): string | null {
    return this.user?.email ?? null;
  }

  public getUserDOB(): Date | undefined {
    if ('date_of_birth' in this.user) {
      return new Date((this.user as UserResponse).date_of_birth);
    }
    return undefined;
  }

  public getUserJobType(): {code: string, name: string} | undefined {
    if ('job_type' in this.user) {
      return {code: (this.user as StaffResponse).job_type, name: (this.user as StaffResponse).job_type === 'D' ? 'Doctor' : 'Nurse'} 
    }
    return undefined;
  }

  public getUserAllergies(): string | null {
    if ('allergies' in this.user) {
      return (this.user as UserResponse).allergies;
    }
    return null;
  }

  public getUserID(): number | null {
    if ('patient_id' in this.user) {
      return (this.user as UserResponse).patient_id;
    } else if ('staff_id' in this.user) {
      return (this.user as StaffResponse).staff_id;
    }
    return null;
  }

  public getUserRole(): string | null {
    return this.user?.role ?? null;
  }

  public getUserImg(): string | null {
    // @ts-ignore
    return this.user?.imgSrc ?? null;
  }

  public getUserImgExt(): string | null {
    // @ts-ignore
    return this.user?.imgExt ?? null;
  }

  public getUserSalary(): number | null {
    if ('salary' in this.user) {
      return Number((this.user as StaffResponse).salary);
    }
    return null;
  }
  
  public getUserDepartment(): Department | null {
    if ('department_id' in this.user) {
      return {department_id: (this.user as StaffResponse).department_id, department_name: (this.user as StaffResponse).department_name} 
    }
    return null;
  }
  
  public getUserManagerId(): number | null {
    if ('manager_id' in this.user) {
      return (this.user as StaffResponse).manager_id;
    }
    return null;
  }
}

const loginService = new LoginService();

export default loginService;