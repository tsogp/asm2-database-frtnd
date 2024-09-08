<template>
	<div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="appointmentsData" :loading="loading">
				<Column field="schedule_date" header="Appointment Date">
					<template #body="slotProps">
						{{ generateDate(slotProps.data.schedule_date, slotProps.data.slot_number) }}
					</template>
				</Column>
				<Column header="Status">
					<template #body="slotProps">
            <Tag 
              :severity="getTicketSeverity(slotProps.data.ticket_status)" 
              :value="getTicketStatusName(slotProps.data.ticket_status)" />
          </template></Column>
				<Column field="patient_first_name" header="Patient First Name"></Column>
				<Column field="patient_last_name" header="Patient Last Name"></Column>
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
				<Column header="Actions">
					<template #body="slotProps">
						<div class="flex">
							<Button icon="pi pi-file-edit" outlined severity="info" aria-label="Edit"
								@click="() => {
									currentAppointmentId = slotProps.data.appointment_id;
									finishAppointmentDialogVisible = true;
								}" class="mr-2" />
							<Button icon="pi pi-check" outlined severity="success" aria-label="Finish"
								@click="() => {
									currentAppointmentId = slotProps.data.appointment_id;
									finishAppointmentDialogVisible = true;
								}" />
						</div>
					</template>
				</Column>
			</DataTable>
    </div>
  </div>
  <Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="(data) => page = data.page + 1"></Paginator>
	<Dialog v-model:visible="treatmentDialogVisible" header="Related Treatments" modal
    :contentStyle="{ height: '300px' }">
    <div class="flex flex-col gap-y-2 h-full">
      <DataTable :value="treatmentData" :loading="treatmentLoading" scrollable scrollHeight="flex"
        tableStyle="min-width: 50rem" class="flex-1">
        <Column field="treatment_name" header="Name"></Column>
        <Column field="treatment_date" header="Date">
          <template #body="{ data }">
            {{ dayjs(data.treatment_date).format('MMM D, YYYY') }}
          </template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <Tag 
              :severity="getTicketSeverity(data.is_overdue)" 
              :value="getTicketStatusName(data.is_overdue)" />
          </template>
        </Column>
				<Column header="Actions">
					<template #body="{ data }">
						<div class="flex">
							<Button icon="pi pi-file-edit" outlined severity="info" aria-label="Edit"
								@click="() => {}" class="mr-2" />
							<Button icon="pi pi-check" outlined severity="success" aria-label="Finish"
								@click="() => handleFinishTreatment(data.treatment_id)" class="mr-2" />
							<Button icon="pi pi-times" outlined severity="danger" aria-label="Cance;]l"
								@click="() => handleMarkTreatmentMissing(data.treatment_id)" />
						</div>
					</template>
				</Column>
      </DataTable>
      <Paginator v-model:rows="treatmentPaginatorRows" :totalRecords="treatmentTotalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
          @page="(data) => page = data.page + 1"></Paginator>
    </div>
    <template #footer>
      <Button label="Ok" icon="pi pi-check" @click="treatmentDialogVisible = false" />
    </template>
  </Dialog>
	<Dialog v-model="finishAppointmentDialogVisible" header="Finish Appointment" :visible="finishAppointmentDialogVisible" modal>
		<p class="text-xl font-semibold">Are you sure you want to finish this appointment?</p>
    <template #footer>
      <div class="flex flex-row gap-x-2">
        <Button label="Cancel" icon="pi pi-times" outlined severity="danger" @click="finishAppointmentDialogVisible = false" />
        <Button label="I am sure" icon="pi pi-check" outlined severity="success" @click="handleFinishAppointment()" />
      </div>
    </template>
	</Dialog>
	<Dialog v-model="editAppointmentDialogVisible" header="Edit Appointment" :visible="editAppointmentDialogVisible" modal>
		<p>Are you sure you want to edit this appointment?</p>
		<div class="flex justify-end">
			<Button label="No" class="mr-2" @click="editAppointmentDialogVisible = false" />
			<Button label="Yes" class="mr-2" @click="editAppointmentDialogVisible = false" />
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import appointmentService from '@/src/services/AppointmentService/AppointmentService';
import { StaffAppointment, Treatment } from '@/src/services/AppointmentService/interfaces';
import loginService from '@/src/services/LoginService/LoginService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Paginator from 'primevue/paginator';
import { onMounted, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import treatmentRecordService from '@/src/services/TreatmentRecordService/TreatmentRecordService';

dayjs.extend(utc);

const loading = ref(false);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

const appointmentsData = ref<StaffAppointment[]>([]);

const toast = useToast();

watch([page, paginatorRows], async () => {
  await fetchAppointmentData();
})

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

const fetchAppointmentData = async () => {
	loading.value = true;
	const response = await appointmentService.getStaffAppointments(
		{ 
			page: page.value, 
			limit: paginatorRows.value, 
			role: loginService.getUserRole() ?? 'staff', 
			id: loginService.getUserID() ?? 0, 
		},
		(errorMessage) => console.log(errorMessage)
	); 

	appointmentsData.value = response.results.map((appointment) => {
		return {
			...appointment,
			schedule_date:  dayjs(appointment.schedule_date).hour(getTimeSlotHour(appointment.slot_number)),
		}
	});

	totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
	loading.value = false;
}

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

const currentAppointmentId = ref(0);

const finishAppointmentDialogVisible = ref(false);
const editAppointmentDialogVisible = ref(false);

const handleFinishAppointment = async () => {
	await appointmentService.finishAppointment(
		{appointment_id: currentAppointmentId.value},
		async () => {
			toast.add({severity: 'success', summary: 'Success', detail: 'Appointment finished successfully.'});
			finishAppointmentDialogVisible.value = false;
			await fetchAppointmentData();
		},
		(errorMessage) => {
			toast.add({severity: 'error', summary: 'Error', detail: errorMessage});
			finishAppointmentDialogVisible.value = false;
		},
	);
}

const handleFinishTreatment = async (id: number) => {
	await treatmentRecordService.markTreatmentRecordAsFinished(
		{ id },
		async () => {
			toast.add({severity: 'success', summary: 'Success', detail: 'Treatment finished successfully.'});
			finishAppointmentDialogVisible.value = false;
			await fetchAppointmentData();
		},
		(errorMessage) => {
			toast.add({severity: 'error', summary: 'Error', detail: errorMessage});
			finishAppointmentDialogVisible.value = false;
		},
	);
}

const handleMarkTreatmentMissing = async (id: number) => {
	await treatmentRecordService.markTreatmentRecordAsMissing(
		{ id },
		async () => {
			toast.add({severity: 'success', summary: 'Success', detail: 'Treatment marked as missing successfully.'});
			finishAppointmentDialogVisible.value = false;
			await fetchAppointmentData();
		},
		(errorMessage) => {
			toast.add({severity: 'error', summary: 'Error', detail: errorMessage});
			finishAppointmentDialogVisible.value = false;
		},
	);
}

onMounted(async () => {
	await fetchAppointmentData();
})
</script>