import { Treatment } from "@/src/services/AppointmentService/interfaces"
import { Dayjs } from "dayjs"

export interface VisibleAppointment {
  staff_id: number,
  purpose: string,
  department_name: string,
  appointment_id: number,
  date: Dayjs,
  slot_number: number,
  job_type: string,
  is_overdue: string,
  staff_name: string,
}