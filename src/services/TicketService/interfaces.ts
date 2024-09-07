export interface CreateTicketRequest {
	newFirstName: string, 
	newLastName: string, 
	newGender: string, 
	newSalary?: number, 
	newJobType?: string, 
	newDepartmentID?: number,
}