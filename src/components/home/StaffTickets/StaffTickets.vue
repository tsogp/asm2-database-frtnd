<template>
	<div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="ticketsWithChangesData" :loading="loading">
        <Column field="created_date" header="Created Date">
          <template #body="slotProps">
            {{ slotProps.data.created_date.format('MMM D, YYYY') }}
          </template>
        </Column>
        <Column field="newStaffDepartmentName" header="Department"></Column>
        <Column field="newStaffJobType" header="Job Type"></Column>
        <Column field="newStaffSalary" header="Salary"></Column>
        <Column field="newStaffLastName" header="Last Name"></Column>
        <Column field="newStaffFirstName" header="First Name"></Column>
        <Column field="newStaffGender" header="New Gender"></Column>
        <Column header="Status">
          <template #body="slotProps">
            <Tag 
              :severity="getTicketSeverity(slotProps.data.ticket_status)" 
              :value="getTicketStatusName(slotProps.data.ticket_status)" />
          </template>
        </Column>
        <!-- <Column header="Actions">
          <template #body="slotProps">
            <Button icon="pi pi-file-edit" outlined severity="info" aria-label="Edit"
              @click="() => {

              }" :disabled="slotProps.data.ticket_status === 'C'" class="mr-2" />
            <Button icon="pi pi-times" outlined severity="danger" aria-label="Cancel"
              @click="() => {
                cancelDialogVisible = true;
              }" :disabled="slotProps.data.ticket_status === 'C'" />
          </template>
        </Column> -->
      </DataTable>
    </div>
  </div>
  <Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="(data) => page = data.page + 1"></Paginator>
</template>

<script setup lang="ts">
import ticketService from '@/src/services/TicketService/TicketService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import { onMounted, ref, watch } from 'vue';
import { ChangesTicketReport } from './interfaces';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

const ticketsWithChangesData = ref<ChangesTicketReport[]>([]);
const loading = ref(false);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

watch([page, paginatorRows], async () => {
  await fetchTickets();
})

const getTicketSeverity = (status: string) => {
  switch (status) {
    case 'U':
      return 'info';
    case 'F':
      return 'success';
    case 'C':
      return 'danger';
		case 'M':
      return 'danger';
    default:
      return 'info';
  }
}

const getTicketStatusName = (status: string) => {
  switch (status) {
    case 'U':
      return 'Upcoming';
    case 'F':
      return 'Finished';
    case 'C':
      return 'Cancelled';
		case 'M':
      return 'Missing';
    default:
      return 'Upcoming';
  }
}

const fetchTickets = async () => {
  loading.value = true;

  const response = await ticketService.getMyTickets(
    { page: page.value, limit: paginatorRows.value },
    (errorMessage) => console.log(errorMessage)
  )

  ticketsWithChangesData.value = response.results.map(ticket => ({
    ticket_id: ticket.ticket_id,
    created_date: dayjs(ticket.created_date).add(7, 'hour'),
    newStaffDepartmentName: ticket.staff_department_name === ticket.ticket_department_name 
      ? 'N/A' 
      : `${ticket.staff_department_name} -> ${ticket.ticket_department_name}`,
    newStaffJobType: ticket.staff_job_type === ticket.ticket_job_type
      ? 'N/A'
      : `${ticket.staff_job_type} -> ${ticket.ticket_job_type}`,
    newStaffSalary: ticket.staff_salary === ticket.ticket_salary
      ? 'N/A'
      : `${ticket.staff_salary} -> ${ticket.ticket_salary}`,
    newStaffLastName: ticket.staff_last_name === ticket.ticket_last_name
      ? 'N/A'
      : `${ticket.staff_last_name} -> ${ticket.ticket_last_name}`,
    newStaffFirstName: ticket.staff_first_name === ticket.ticket_first_name
      ? 'N/A'
      : `${ticket.staff_first_name} -> ${ticket.ticket_first_name}`,
    newStaffGender: ticket.staff_gender === ticket.ticket_gender
      ? 'N/A'
      : `${ticket.ticket_gender} -> ${ticket.staff_gender}`, 
    ticket_status: ticket.ticket_status,
  }));

	totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
}

onMounted(async () => {
  await fetchTickets();
})

</script>