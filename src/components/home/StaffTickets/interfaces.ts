import { Dayjs } from "dayjs";

export interface ChangesTicketReport {
	newStaffFirstName: string;
	newStaffLastName: string;
	newStaffGender: string;
	newStaffSalary: string;
	newStaffJobType: string;
	newStaffDepartmentName: string;
	ticket_id: number;
	created_date: Dayjs;
	ticket_status: string;
}