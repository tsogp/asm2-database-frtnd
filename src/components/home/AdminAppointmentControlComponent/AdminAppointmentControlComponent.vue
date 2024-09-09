<template>
<div class="flex-1 overflow-y-auto">
	<div class="card">
		<DataTable :value="appointmentsData" :loading="loading">
			<template #empty>
				<div class="p-4 text-center">
					<span class="text-lg">No appointments yet.</span>
				</div>
			</template>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">Appointments</span>
				</div>
			</template>
			<Column field="schedule_date" header="Appointment Date">
				<template #body="slotProps">
					{{ generateDate(slotProps.data.schedule_date, slotProps.data.slot_number) }}
				</template>
			</Column>
			<Column header="Status">
				<template #body="slotProps">
					<Tag 
						:severity="getTicketSeverity(slotProps.data.status)" 
						:value="getTicketStatusName(slotProps.data.status)" />
				</template></Column>
			<Column field="staff_first_name" header="Staff First Name"></Column>
			<Column field="staff_last_name" header="Staff Last Name"></Column>
			<Column field="purpose" header="Purpose"></Column>
			<Column header="Treatments">
				<template #body="{ data }">
					<Button icon="pi pi-ellipsis-h" severity="secondary" outlined
						@click="() => { 
							currentAppointmentId = data.appointment_id;
							treatmentDialogVisible = true; 
							fetchTreatmentDataById(data.appointment_id);
						}"></Button>
				</template>
			</Column>
			<Column header="Billing">
				<template #body="{ data }">
					<Button icon="pi pi-file" severity="info" outlined
						@click="async () => { 
							currentAppointmentId = data.appointment_id;
							await fetchBillingData();
							reportDialogVisible = true; 
						}" :disabled="data.status !== 'F'"</Button>
				</template>
			</Column>
		</DataTable>
	</div>
</div>
<Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
	@page="(data) => page = data.page + 1"></Paginator>
<Dialog v-model:visible="treatmentDialogVisible" header="Related Treatments" modal :contentStyle="{ height: '500px' }">
	<div class="flex flex-col gap-y-2 h-full">
		<div class="flex-1 overflow-y-auto">
			<DataTable :value="treatmentData" :loading="treatmentLoading" scrollable scrollHeight="flex"
				tableStyle="min-width: 50rem" class="flex-1">
				<template #empty>
					<div class="p-4 text-center">
						<span class="text-lg">No tickets yet.</span>
					</div>
				</template>
				<template #header>
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span class="text-xl font-bold">My Appointments</span>
					</div>
				</template>
				<Column field="treatment_name" header="Name"></Column>
				<Column field="treatment_date" header="Date">
					<template #body="{ data }">
						{{ dayjs(data.treatment_date).format('MMM D, YYYY') }}
					</template>
				</Column>
				<Column field="treatment_cost" header="Cost"></Column>
				<Column header="Status">
					<template #body="{ data }">
						<Tag 
							:severity="getTicketSeverity(data.treatment_status)" 
							:value="getTicketStatusName(data.treatment_status)" />
					</template>
				</Column>
			</DataTable>
		</div>
		<Paginator v-model:rows="treatmentPaginatorRows" :totalRecords="treatmentTotalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
				@page="(data) => page = data.page + 1"></Paginator>
	</div>
	<template #footer>
		<Button label="Ok" icon="pi pi-check" @click="treatmentDialogVisible = false" />
	</template>
</Dialog>
<Dialog v-model:visible="reportDialogVisible" header="Billing Report" modal>
	<div>
		<div class="flex items-center justify-center">
			<i class="pi pi-info-circle mr-3" style="font-size: 1.5rem"></i>
			<span class="font-normal">{{ billingData.message }}</span>
		</div>
		<div v-if="billingData.data !== undefined" class="flex flex-col gap-x-2 mt-2">
			<span>
				<span class="font-bold">Staff Name:</span> {{ billingData.data.staff_first_name }} {{ billingData.data.staff_last_name }}
			</span>
			<span>
				<span class="font-bold">Department:</span> {{ billingData.data.department_name }}
			</span>
			<span>
				<span class="font-bold">Patient ID:</span> {{ billingData.data.patient_id }}
			</span>
			<span>
				<span class="font-bold">Patient Name:</span> {{ billingData.data.patient_first_name }} {{ billingData.data.patient_last_name }}
			</span>
			<span>
				<span class="font-bold">Total Cost:</span> {{ billingData.data.total_cost }}
			</span>
		</div>
	</div>	
	<template #footer>
		<Button label="Ok" icon="pi pi-check" @click="reportDialogVisible = false" />
	</template>
</Dialog>
</template>

<script setup lang="ts">
import appointmentService from '@/src/services/AppointmentService/AppointmentService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import { Appointment, Treatment } from '@/src/services/AppointmentService/interfaces';
import { onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import treatmentRecordService from '@/src/services/TreatmentRecordService/TreatmentRecordService';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import reportService from '@/src/services/ReportService/ReportService';
import { GetBillingRes } from '@/src/services/ReportService/interfaces';

dayjs.extend(utc);

const toast = useToast();

const appointmentsData = ref<Appointment>([]);
const loading = ref(false);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

watch([page, paginatorRows], async () => {
	await fetchAllAppointemnts();
})

const fetchAllAppointemnts = async () => {
	loading.value = true;
	
	const response = await appointmentService.getAllAppointments(
		{ page: page.value, limit: paginatorRows.value }, 
		() => console.log('fetchErrror')
	);

	appointmentsData.value = response.results.map(item => {
		return {
			...item,
			schedule_date: dayjs(item.schedule_date).add(item.slot_number + 8, 'hour'),
		}
	});
	totalRecords.value = response.pagination.totalRecords;
	totalPages.value = response.pagination.totalPages;

	console.log(appointmentsData.value);

	loading.value = false;
}

const getTimeSlotHour = (slot: number) => {
  // don't ask
  return slot + 8;
}

const generateDate = (date: Dayjs, slot: number) => {
  const slotHour = getTimeSlotHour(slot);

  return `${date.format('MMM D, YYYY H:mm')} - ${slotHour + 1}:00`;
}

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

const currentAppointmentId = ref(0);

const treatmentDialogVisible = ref(false);

const treatmentLoading = ref(false);

const treatmentData = ref<Treatment[]>([]);

const treatmentPage = ref(1);
const treatmentPaginatorRows = ref(5);
const treatmentTotalRecords = ref(0);
const treatmentTotalPages = ref(0);

watch([treatmentPage, treatmentPaginatorRows], async () => {
  await fetchTreatmentDataById(currentAppointmentId.value);
})

const fetchTreatmentDataById = async (id: number) => {
  treatmentLoading.value = true;
  const response = await treatmentRecordService.getTreatmentRecordByAppointment(
    { id },
    { page: treatmentPage.value, limit: treatmentPaginatorRows.value },
    () => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t fetch the treatments.', life: 5000 })
  )

  treatmentData.value = response.results;

  treatmentTotalRecords.value = response.pagination.totalRecords;
  treatmentTotalPages.value = response.pagination.totalPages;

  treatmentLoading.value = false;
}

const reportDialogVisible = ref(false);
const reportLoading = ref(false);
const billingData = ref<any | null>();

const fetchBillingData = async () => {
	reportLoading.value = true;

	const response = await reportService.getBilling(
		{ appointment_id: currentAppointmentId.value },
		() => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t fetch the billing report.', life: 5000 })
	)

	billingData.value = response;
	console.log(billingData.value);
	reportLoading.value = false;
}

onMounted(async () => {
	await fetchAllAppointemnts();
})
</script>