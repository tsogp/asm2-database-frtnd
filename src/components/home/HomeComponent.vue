<template>
	<FullHeightComponent>
    <div class="flex flex-col h-full">
      <HeaderComponent />
      <router-view />
    </div>
	</FullHeightComponent>
</template>

<script setup lang="ts">
import FullHeightComponent from '@/src/components/utils/FullHeightComponent.vue';
import HeaderComponent from '@/src/components/home/HeaderComponent.vue';
import patientService from '@/src/services/PatientService/PatientService';
import { onMounted } from 'vue';
import treatmentMenuService from '@/src/services/TreatmentMenuService/TreatmentMenuService';
import treatmentRecordService from '@/src/services/TreatmentRecordService/TreatmentRecordService';
import dayjs from 'dayjs';
import scheduleService from '@/src/services/ScheduleService/ScheduleService';
import appointmentService from '@/src/services/AppointmentService/AppointmentService';
import reportService from '@/src/services/ReportService/ReportService';
import ticketService from '@/src/services/TicketService/TicketService';

onMounted(async () => {
  let response;
  // response = await patientService.getAllPatients({page:1,limit:10}, (errorMsg) => console.log(errorMsg))
  // response = await treatmentMenuService.getAllMenus((err) => console.log(err));
  // response = await treatmentMenuService.getTreatmentMenuById({id: 1}, (err) => console.log(err));
  // response = await treatmentMenuService.addTreatmentMenu({ treatment_name: 'Mental Treatment 2', treatment_cost: 10000}, 
  //   () => console.log('treatment menu added!'), 
  //   (err) => console.log(err));
  
  
  // response = await treatmentRecordService.getMyTreatmentRecords({page: 1, limit: 10}, (err) => console.log(err));
  // response = await treatmentRecordService.getTreatmentRecordByAppointment({id : 3}, {page: 1, limit: 10}, (err) => console.log(err));
  // response = await treatmentRecordService.getTreatmentRecordByPatient({id : 41}, {page: 1, limit: 10}, (err) => console.log(err));
  // response = await treatmentRecordService.getTreatmentRecordById({id : 2}, (err) => console.log(err));
  // response = await treatmentRecordService.addTreatmentRecord({ treatment_id : 3, treatment_date : "2024-09-04xx", appointment_id : 3}, 
  //   () => console.log('treatment record added!'), 
  //   (err) => console.log(err));
  // response = await treatmentRecordService.markTreatmentRecordAsFinished({id : 3}, 
  //   () => console.log('treatment record marked as finished!'), 
  //   (err) => console.log(err));
  
  
  // response = await scheduleService.getAllSchedule({page: 1, limit: 10}, (err) => console.log(err));
  // response = await scheduleService.getScheduleByStaff({id: 2}, (err) => console.log(err));
  // response = await scheduleService.getFreeSchedule({page: 1, limit: 10}, (err) => console.log(err));
  
  
  // response = await appointmentService.getAllAppointments({page: 1, limit: 5}, (err) => console.log(err));
  // response = await appointmentService.getAppointmentsByPatientId({id: 41}, {page: 1, limit: 5, status :'U'}, (err) => console.log(err));
  // response = await appointmentService.bookAppointment(
  //   { patientID: 41, doctorID: 4, date: '2024-09-13', slotNumber: 4, purpose: 'database consult'}, 
  //   () => console.log('appointment booked!'), 
  //   (err) => console.log(err));
  // response = await appointmentService.updateAppointment({appointmentId: 21, date: '2024-09-13', timeSlot: 3}, 
  //   () => console.log('appointment updated!'), 
  //   (err) => console.log(err));
  // response = await appointmentService.finishAppointment({appointment_id: 1}, 
  //   () => console.log('appointment finished!'), 
  //   (err) => console.log(err));
  
  
  // response = await reportService.getPatientTreatmentRecordReport(
  //   {start_date: '2024-01-01', end_date : '2024-12-12', email : 'jennifer@gmail.com'}, 
  //   (err) => console.log(err));
  // response = await reportService.getStaffHistory(
  //   {start_date: '2024-01-01', end_date : '2024-12-12', email: 'alice.williams@hospital.management.com'}, 
  //   (err) => console.log(err));
  // response = await reportService.getStaffJobChange(
  //   {start_date: '2024-01-01', end_date : '2024-12-12', email: 'alice.williams@hospital.management.com'},
  //   (err) => console.log(err));
  // response = await reportService.getBilling({appointment_id : 1}, (err) => console.log(err));
  
  
  // response = await ticketService.getAllTickets({page: 1, limit: 5}, (err) => console.log(err));
  // response = await ticketService.getMyTickets({page: 1, limit: 5}, (err) => console.log(err));
  // response = await ticketService.createNewTicket({ newFirstName: "Truong 33", newLastName : "Nhan 4", newGender: "O", newManagerId: 3, newSalary: 2000, "newJobType": "N", newDepartmentID: 4, notes : "I am re-considering my career path"}, 
  //   () => console.log('ticket created!'), 
  //   (err) => console.log(err));
  // response = await ticketService.approveTicket({ticket_id: 2}, 
  //   () => console.log('ticket approved!'), 
  //   (err) => console.log(err));
  // response = await ticketService.rejectTicket({ticket_id: 3}, 
  //   {note : 'Who asks?'},
  //   () => console.log('ticket rejected!'), 
  //   (err) => console.log(err));
  // response = await ticketService.updateTicket(
  //   {ticket_id:1}, 
  //   { newFirstName : "testing", newLastName : "testing 3", "newGender": "O", newManagerId: 3, newSalary: 302, newJobType: "D", newDepartmentID: 3, notes : "I am re-considering my career path" }, 
  //   () => console.log('ticket updated!'), 
  //   (err) => console.log(err));
  // response = await ticketService.deleteTicket({ticket_id: 2}, 
  //   () => console.log('ticket deleted!'), 
  //   (err) => console.log(err));
    
  
  console.log(response);
});
  
</script>