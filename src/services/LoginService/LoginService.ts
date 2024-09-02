import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { IUser, UserResponse } from "./interfaces";
import dayjs, { Dayjs } from "dayjs";
import router from "@/src/router";

class LoginService {
  private requestService: RequestServiceType;
  public user: IUser | null;

  constructor() {
    this.requestService = requestService;
    this.user = localStorage.getItem('user') !== null
      ? JSON.parse(localStorage.getItem('user') ?? '')
      : null;
  }

  public async patientLogin(email: string, password: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      await this.requestService.postWithAuth<null>('/auth/patient/login', 
        {
          email,
          password
        },
      );

      const response = await this.requestService.getWithAuth<UserResponse>('/patient/myInfo');
      
      this.user = {
        ...response.data,
        role: 'patient',
      };
      localStorage.setItem('user', JSON.stringify(this.user));

      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
    }
  }

  public async staffLogin(email: string, password: string, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      await this.requestService.postWithAuth<null>('/auth/staff/login', 
        {
          email,
          password
        },
      );
      
      const response = await this.requestService.getWithAuth<UserResponse>('/staff/myInfo');

      this.user = {
        ...response.data,
        role: 'staff',
      };
      localStorage.setItem('user', JSON.stringify(this.user));

      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
    }
  }

  public async logout(onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      const response = await this.requestService.deleteWithAuth<null>('/auth/logout');

      this.cleanUser();

      router.push('/signup')
      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
    }
  }

  public isAuthenticated(): boolean {
    return this.user !== null;
  }

  public cleanUser(): void {
    this.user = null;
    localStorage.removeItem('user');
  }

  public getUserFirstName(): string {
    return this.user?.first_name ?? '';
  }

  public getUserLastName(): string {
    return this.user?.last_name ?? '';
  }

  public getUserGender(): string {
    return this.user?.gender ?? '';
  }

  public getUserEmail(): string {
    return this.user?.email ?? '';
  }

  public getUserDOB(): Dayjs {
    return this.user?.date_of_birth ?? dayjs();
  }

  public getUserAllergies(): string[] {
    return this.user?.allergies ?? [];
  }

  public getUserID(): number {
    return this.user?.patient_id ?? 0;
  }
}

const loginService = new LoginService();

export default loginService;