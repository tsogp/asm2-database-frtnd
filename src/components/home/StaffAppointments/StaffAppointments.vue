<template>
	<div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="appointmentsData" :loading="loading">
				<template #empty>
					<div class="p-4 text-center">
						<span class="text-lg">No appointments yet.</span>
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
							<!-- <Button icon="pi pi-file-edit" outlined severity="info" aria-label="Edit"
								@click="() => {
									currentAppointmentId = slotProps.data.appointment_id;
									finishAppointmentDialogVisible = true;
								}" class="mr-2" :disabled="slotProps.data.status === 'F'" /> -->
							<Button icon="pi pi-check" outlined severity="success" aria-label="Finish"
								@click="() => {
									currentAppointmentId = slotProps.data.appointment_id;
									finishAppointmentDialogVisible = true;
								}" :disabled="slotProps.data.status === 'F'" />
						</div>
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
							<span class="text-lg">No treatments yet.</span>
						</div>
					</template>
					<template #header>
						<div class="flex flex-wrap items-center justify-between gap-2">
							<span class="text-xl font-bold">Treatments</span>
							<div class="flex flex-row gap-x-2">
								<Button icon="pi pi-plus" rounded raised @click="() => {
									fetchAllTreatmentData();
									createAppointmentDialogVisible = true;
								}" />
							</div>
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
					<Column header="Actions">
						<template #body="{ data }">
							<div class="flex">
								<Button icon="pi pi-check" outlined severity="success" aria-label="Finish"
									@click="() => handleFinishTreatment(data.record_id)" class="mr-2" :disabled="data.treatment_status !== 'U'" />
								<Button icon="pi pi-times" outlined severity="danger" aria-label="Cancel"
									@click="() => handleMarkTreatmentMissing(data.record_id)" :disabled="data.treatment_status !== 'U'" />
							</div>
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
		<template #footer>
			<Button label="No" class="mr-2" @click="editAppointmentDialogVisible = false" />
			<Button label="Yes" class="mr-2" @click="editAppointmentDialogVisible = false" />
		</template>
	</Dialog>
	<Dialog header="Add treatment" :visible="createAppointmentDialogVisible" modal :style="{ width: '34rem' }">
		<div class="flex flex-col gap-y-1">
			<div class="flex flex-row items-center gap-x-1">
				<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
				<label for="dept" class="font-semibold">Treatment Type</label>
			</div>
			<Select 
				v-model="chosenTreatmentMenu" 
				:options="allTreatmentData" 
				optionLabel="treatment_name" 
				placeholder="Select a Treatment" 
				class="w-full"
				:loading="allTreatmentLoading"
			/>

			<div class="flex flex-row items-center gap-x-1">
				<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
				<label for="dept" class="font-semibold">Treatment Date</label>
			</div>

			<Select 
				v-model="chosenTreatmentDate" 
				:options="doctorSchedules" 
				placeholder="Select a date" 
				class="w-full"
				:loading="allTreatmentLoading"
				:disabled="!chosenTreatmentMenu"
			>
				<template #option="{ option }">
					{{ option.format('MMM D, YYYY') }}
				</template>
			</Select>
		</div>
		<template #footer>
			<Button label="Cancel" icon="pi pi-times" class="mr-2" outlined severity="danger" @click="createAppointmentDialogVisible = false" />
			<Button label="Add treatment" icon="pi pi-check" class="mr-2" outlined severity="success" @click="() => {
				handleCreateNewTreatment();
			}" />
		</template>
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
import treatmentMenuService from '@/src/services/TreatmentMenuService/TreatmentMenuService';
import { TreatmentMenu } from '@/src/services/TreatmentMenuService/interfaces';
import Select from 'primevue/select';
import scheduleService from '@/src/services/ScheduleService/ScheduleService';
import { FreeSchedule } from '@/src/services/ScheduleService/interfaces';
import FreeScheduleComponent from '../FreeScheduleComponent.vue';

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
		case 'R':
			return 'danger';
		case 'P':
				return 'info';
		case 'A':
			return 'success';
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
		case 'P':
			return 'Pending';
		case 'A':
			return 'Approved';
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
			toast.add({severity: 'success', summary: 'Success', detail: 'Appointment finished successfully.', life: 5000});
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
			toast.add({severity: 'success', summary: 'Success', detail: 'Treatment finished successfully.', life: 5000});
			finishAppointmentDialogVisible.value = false;
			await fetchTreatmentDataById(currentAppointmentId.value);
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
			toast.add({severity: 'success', summary: 'Success', detail: 'Treatment marked as missing successfully.', life: 5000});
			finishAppointmentDialogVisible.value = false;
			await fetchTreatmentDataById(currentAppointmentId.value);
		},
		(errorMessage) => {
			toast.add({severity: 'error', summary: 'Error', detail: errorMessage});
			finishAppointmentDialogVisible.value = false;
		},
	);
}

const createAppointmentDialogVisible = ref(false);
const allTreatmentLoading = ref(false);
const allTreatmentData = ref<TreatmentMenu[]>([]);
const chosenTreatmentMenu = ref<TreatmentMenu | null>(null);

const fetchAllTreatmentData = async () => {
	allTreatmentLoading.value = true;

	const response = await treatmentMenuService.getAllTreatmentMenus(
		(errorMessage) => console.log(errorMessage)
	)

	allTreatmentData.value = response.results;
	console.log(allTreatmentData.value);
	allTreatmentLoading.value = false;
}

const doctorSchedules = ref<Dayjs[]>([]);
const chosenTreatmentDate = ref<Dayjs | null>(null);

watch(chosenTreatmentMenu, () => {
  if (chosenTreatmentMenu.value) {
    fetchChosenDoctorSchedule();
  }
})

const fetchChosenDoctorSchedule = async () => {
  const response = await scheduleService.getFreeScheduleById(
    loginService.getUserID() ?? 0,
    (errorId) => {}
  )

  doctorSchedules.value = response.results.map(item => dayjs(item.schedule_date).add(7, 'hour'));

	console.log(doctorSchedules.value);
}

const handleCreateNewTreatment = async () => {
	if (!chosenTreatmentMenu.value || !chosenTreatmentDate.value) {
		toast.add({severity: 'error', summary: 'Error', detail: 'Please select a treatment and a time slot.'});
		return;
	}

	await treatmentRecordService.addTreatmentRecord(
		{
			appointment_id: currentAppointmentId.value,
			treatment_id: chosenTreatmentMenu.value.treatment_id,
			treatment_date: chosenTreatmentDate.value.toISOString().split('T')[0],
		},
		async () => {
			toast.add({severity: 'success', summary: 'Success', detail: 'Treatment added successfully.', life: 5000});
			createAppointmentDialogVisible.value = false;
			await fetchTreatmentDataById(currentAppointmentId.value);
		},
		(errorMessage) => {
			toast.add({severity: 'error', summary: 'Error', detail: errorMessage, life: 5000});
			createAppointmentDialogVisible.value = false;
		},
	)
}

onMounted(async () => {
	await fetchAppointmentData();
})
</script>