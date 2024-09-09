<template>
<ConfirmPopup></ConfirmPopup>
<ConfirmPopup group="reject">
	<template #message="slotProps">
		<div class="flex flex-col gap-y-2 m-3">
			<div class="flex items-center justify-center">
				<i class="pi pi-info-circle mr-3" style="font-size: 1.5rem"></i>
				<span class="font-normal">Do you want to reject this ticket?</span>
			</div>
			<InputTextWrapper 
				v-model="rejectReason" 
				id="reject_reason" 
				type="text" 
				placeholder="e.g. not appropriate"  
				label="Enter the reason for rejection"
				:is-required="true"
			/>
		</div>
	</template>
</ConfirmPopup>
<div class="flex-1 overflow-y-auto">
	<div class="card">
		<DataTable :value="ticketsWithChangesData" tableStyle="min-width: 50rem" :loading="loading">
			<template #empty>
				<div class="p-4 text-center">
					<span class="text-lg">No tickets yet.</span>
				</div>
			</template>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">All tickets</span>
					<div class="flex flex-row gap-x-2">
						<Button icon="pi pi-refresh" rounded raised @click="fetchAllTickets()" />
					</div>
				</div>
			</template>
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
				<Column header="Actions">
					<template #body="slotProps">
						<div class="flex flex-row gap-x-2">
						<Button icon="pi pi-check" outlined severity="success" aria-label="Approve"
							@click="(event: Event) => {
								currentTicketId = slotProps.data.ticket_id;
								confirmApprove(event);
							}" :disabled="slotProps.data.ticket_status !== 'U'" />
						<Button icon="pi pi-times" outlined severity="danger" aria-label="Reejct"
							@click="(event: Event) => {
								currentTicketId = slotProps.data.ticket_id;
								rejectReason = '';
								confirmDelete(event);
								console.log(slotProps.data.ticket_id);
							}" :disabled="slotProps.data.ticket_status !== 'U'" />
						</div>
					</template>
				</Column>
		</DataTable>
	</div>
</div>
<Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
	@page="(data) => page = data.page + 1"></Paginator>
</template>

<script setup lang="ts">
import { TicketReport } from '@/src/services/TicketService/interfaces';
import ticketService from '@/src/services/TicketService/TicketService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import dayjs from 'dayjs';
import InputTextWrapper from '../../utils/InputTextWrapper.vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { onMounted, ref, watch } from 'vue';
import { ChangesTicketReport } from '../StaffTickets/interfaces';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';

const loading = ref(false);
const toast = useToast();
const confirm = useConfirm();

const ticketsData = ref<TicketReport[]>([]);
const ticketsWithChangesData = ref<ChangesTicketReport[]>([]);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

watch([page, paginatorRows], async () => {
  await fetchAllTickets();
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
		case 'R':
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
		case 'R':
			return 'Rejected';
    default:
      return 'Upcoming';
  }
}

const fetchAllTickets = async () => {
  loading.value = true;

  const response = await ticketService.getAllTickets(
    { page: page.value, limit: paginatorRows.value },
    (errorMessage) => console.log(errorMessage)
  )

	ticketsData.value = response.results;
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

const currentTicketId = ref<number>(0);

const handleApproveTicket = async () => {
	loading.value = true;

	await ticketService.approveTicket(
		{ ticket_id: currentTicketId.value },
		() => {
			toast.add({ severity: 'success', summary: 'Success', detail: 'Ticket approved successfully', life: 5000 });
			fetchAllTickets();
		},
		() => toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve ticket', life: 5000 }),
	);

	await fetchAllTickets();
}

const rejectReason = ref<string>('');

const handleRejectTicket = async () => {
	if (rejectReason.value === '') {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Please enter a reason for rejection',
			life: 5000
		});
		return;
	}

	loading.value = true;

	await ticketService.rejectTicket(
		{ ticket_id: currentTicketId.value },
		{ note: rejectReason.value },
		() => {
			toast.add({ severity: 'success', summary: 'Success', detail: 'Ticket rejected successfully', life: 5000 });
			fetchAllTickets();
		},
		() => toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject ticket', life: 5000 })
	);

	await fetchAllTickets();
}

const confirmApprove = (event: Event) => {
	confirm.require({
		target: event.currentTarget as HTMLElement,
		message: 'Do you want to approve this ticket?',
		icon: 'pi pi-info-circle',
		rejectProps: {
			label: 'Cancel',
			severity: 'danger',
			outlined: true
		},
		acceptProps: {
			label: 'Approve',
			severity: 'success',
			outlined: true
		},
		accept: () => {
			handleApproveTicket();
		},
		reject: () => {}
	});
};

const confirmDelete = (event: Event) => {
	confirm.require({
		target: event.currentTarget as HTMLElement,
		group: 'reject',
		message: 'Do you want to reject this ticket?',
		icon: 'pi pi-info-circle',
		rejectProps: {
			label: 'Cancel',
			severity: 'info',
			outlined: true
		},
		acceptProps: {
			label: 'Reject',
			severity: 'danger',
			outlined: true
		},
		accept: () => {
			handleRejectTicket();
		},
		reject: () => {}
	});
};

onMounted(async () => {
	await fetchAllTickets();
})
</script>