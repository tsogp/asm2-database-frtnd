<template>
	<ConfirmPopup></ConfirmPopup>
	<div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="signUpRole === SignUpRoles.PATIENT ? patientsData : staffData" tableStyle="min-width: 50rem" :loading="loading">
				<template #empty>
					<div class="p-4 text-center">
						<span class="text-lg">No users found.</span>
					</div>
				</template>
				<template #header>
          <div class="flex items-center justify-between ">
            <span class="text-xl font-bold">Admin User Control</span>	
            <div class="flex flex-row gap-x-2">
							<SelectButton 
								v-model="signUpRole" 
								:options="signUpRoles"
								:allowEmpty="false"
							/>
							<Button icon="pi pi-plus" raised rounded v-if="signUpRole === SignUpRoles.STAFF" @click="staffAddDialogVisible = true;"/>
							<Button icon="pi pi-refresh" raised rounded @click="(signUpRole === SignUpRoles.PATIENT) ? fetchAllPatients() : fetchAllStaff()" />
            </div>
          </div>
        </template>
				<Column field="patient_id" header="ID" v-if="signUpRole === SignUpRoles.PATIENT"></Column>
				<Column field="staff_id" header="ID" v-else></Column>
				<Column field="email" header="Email"></Column>
				<Column field="first_name" header="First Name"></Column>
				<Column field="last_name" header="Last Name"></Column>
				<Column field="date_of_birth" header="Date of Birth" v-if="signUpRole === SignUpRoles.PATIENT">
					<template #body="{ data }">
						{{ data.date_of_birth.format('MMM D, YYYY') }}
					</template>
				</Column>
				<Column field="gender" header="Gender">
					<template #body="{ data }">
						{{ printGender(data.gender) }}
					</template>
				</Column>
				<Column field="department_name" header="Department" v-if="signUpRole === SignUpRoles.STAFF"></Column>
				<Column field="job_type" header="Job Type" v-if="signUpRole === SignUpRoles.STAFF">
					<template #body="{ data }">
						{{ printJobType(data.job_type) }}
					</template>
				</Column>
				<Column header="Schedule" v-if="signUpRole === SignUpRoles.STAFF">
					<template #body="{ data, frozenRow, index }">
						<Button icon="pi pi-ellipsis-h" severity="secondary" outlined @click="() => {
							fetchChosenDoctorSchedule(data.staff_id);
							scheduleDialogVisible = true;
						}"></Button>
					</template>
				</Column>
				<Column header="Actions">
					<template #body="{ data }">
						<Button icon="pi pi-times" outlined severity="danger" aria-label="Delete"
							@click="(event: Event) => {
								userId = data.patient_id;
								confirmDelete(event);
							}" />
					</template>
				</Column>
				<Column header="Reports">
					<template #body="{ data }">
						<Button icon="pi pi-file" severity="info" outlined @click="() => {
							userId = data.patient_id;
							reportEmail = data.email;
							reportDialogVisible = true;
						}"></Button>
					</template>
				</Column>
      </DataTable>
    </div>
  </div>
  <Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="(data) => page = data.page + 1"></Paginator>
	<Dialog v-model:visible="scheduleDialogVisible" header="Doctor's Schedule" modal>
		<FreeScheduleComponent
			:schedules="doctorSchedules"
			v-model="chosenTimes"
			v-if="doctorSchedules.length > 0"
			title="Doctor's Schedule"
			:showBusy="true"
			:is-required="false"
		/>
		<template #footer>
			<div class="flex justify-end gap-x-2">
				<Button label="Ok" icon="pi pi-check" outlined severity="success" @click="scheduleDialogVisible = false" />
			</div>
		</template>
	</Dialog>
	<Dialog v-model:visible="reportDialogVisible" :header="`${signUpRole === SignUpRoles.PATIENT ? 'Patient' : 'Staff'}'s Report`" modal>
		<div class="flex flex-row gap-x-2">
			<div class="flex flex-col gap-x-1">
				<div class="flex flex-row gap-x-1 mb-1 items-center">
					<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem"></i>
					<label for="start_date" class="font-semibold">Start Date</label>
				</div>
				<DatePicker id="start_date" v-model="reportStartDate" class="w-full" dateFormat="dd/mm/yy" />
			</div>
			<div class="flex flex-col gap-x-1">
				<div class="flex flex-row gap-x-1 mb-1 items-center">
					<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem"></i>
					<label for="end_date" class="font-semibold">End Date</label>
				</div>
				<DatePicker id="end_date" v-model="reportEndDate" class="w-full" dateFormat="dd/mm/yy" />
			</div>
		</div>
		<div class="my-2">
			<SelectButton 
				v-model="staffReport" 
				:options="['Job Change History', 'Staff History']"
				class="w-full"
				:allowEmpty="false"
				v-if="signUpRole === SignUpRoles.STAFF"
			/>
		</div>
		<DataTable :value="reportAppointmentsData" v-if="signUpRole === SignUpRoles.PATIENT" :loading="reportLoading">
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
			<Column field="appointment_id" header="ID"></Column>
			<Column field="treatment_date" header="Appointment Date">
				<template #body="slotProps">
					{{ generateDate(slotProps.data.treatment_date) }}
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
			<Column field="treatment_cost" header="Cost"></Column>
			<Column field="treatment_name" header="Name"></Column>
		</DataTable>
		<DataTable :value="reportStaffHistoryData" v-if="signUpRole === SignUpRoles.STAFF && staffReport === 'Staff History'" :loading="reportLoading">
			<template #empty>
				<div class="p-4 text-center">
					<span class="text-lg">No history yet.</span>
				</div>
			</template>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">Staff History</span>
				</div>
			</template>
			<Column field="schedule_date" header="Schedule Date">
				<template #body="slotProps">
					{{ generateDate(slotProps.data.schedule_date) }}
				</template>
			</Column>
			<Column field="department_name" header="Department"></Column>
			<Column field="job_type" header="Job Type">
				<template #body="slotProps">
					{{ printJobType(slotProps.data.job_type) }}
				</template>
			</Column>
			<Column field="time" header="Time"></Column>
			<Column header="Patient Name">
				<template #body="slotProps">
					{{ slotProps.data.patient_first_name }} {{ slotProps.data.patient_last_name }}
				</template>
			</Column>
			<Column header="Staff Name">
				<template #body="slotProps">
					{{ slotProps.data.staff_first_name }} {{ slotProps.data.staff_last_name }}
				</template>
			</Column>
		</DataTable>
		<DataTable :value="reportStaffJobChangeData" v-if="signUpRole === SignUpRoles.STAFF && staffReport === 'Job Change History'" :loading="reportLoading">
			<template #empty>
				<div class="p-4 text-center">
					<span class="text-lg">No job change history yet.</span>
				</div>
			</template>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">Job Change History</span>
				</div>
			</template>
			<Column field="schedule_date" header="Schedule Date">
				<template #body="slotProps">
					{{ generateDate(slotProps.data.schedule_date) }}
				</template>
			</Column>
			<Column field="department_name" header="Department"></Column>
			<Column field="job_type" header="Job Type">
				<template #body="slotProps">
					{{ printJobType(slotProps.data.job_type) }}
				</template>
			</Column>
			<Column field="time" header="Time"></Column>
		</DataTable>
		<template #footer>
			<div class="flex justify-end gap-x-2">
				<Button label="Ok" icon="pi pi-check" outlined severity="success" @click="reportDialogVisible = false" />
			</div>
		</template>
	</Dialog>
	<Dialog v-model:visible="staffAddDialogVisible" header="Add Staff" modal>
		<InputTextWrapper 
			v-model="currentStaffEmail" 
			id="staff_email" 
			type="email" 
			placeholder="Email"  
			label="Enter staff email"
			:is-required="true"
		/>
		<InputTextWrapper 
			v-model="currentStaffPassword" 
			id="staff_password" 
			type="password" 
			placeholder="Password"  
			label="Enter staff password"
			:is-required="true"
		/>
		<InputTextWrapper 
			v-model="currentStaffFirstName" 
			id="staff_first_name" 
			type="text" 
			placeholder="First Name"  
			label="Enter staff first name"
			:is-required="true"
		/>
		<InputTextWrapper 
			v-model="currentStaffLastName" 
			id="staff_last_name" 
			type="text" 
			placeholder="Last Name"  
			label="Enter staff last name"
			:is-required="true"
		/>
		<div class="flex flex-col gap-y-2">
			<div class="flex flex-row mb-1 items-center gap-x-1">
			<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
			<label for="gender" class="font-semibold">Job Type</label>
		</div>
			<Select 
				v-model="currentJobType" 
				id="job" 
				:options="[{code: 'D', name: 'Doctor'}, {code: 'N', name: 'Nurse'}]" 
				optionLabel="name"
				placeholder="Select a Job Type" 
				class="w-full min-w-[70px]" 
			/>
		</div>
		<div class="flex flex-col gap-y-1 mt-1">
			<div class="flex flex-row mb-1 items-center gap-x-1">
				<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
				<label for="gender" class="font-semibold">Gender</label>
			</div>
			<Select id="gender" v-model="currentGender" :options="[{code: 'M', name: 'Male'}, {code: 'F', name: 'Female'}, {code: 'O', name: 'Other'}]" optionLabel="name" placeholder="Select you gender" class="w-full" />
		</div>
		<div class="flex flex-col gap-y-1 mt-1">
			<div class="flex flex-row mb-1 items-center gap-x-1">
				<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
				<label for="gender" class="font-semibold">Department</label>
			</div>
			<Select v-model="currentDepartment" id="dept" :options="departmentsData" optionLabel="department_name"
			placeholder="Select a Department" class="w-full min-w-[70px]" />
		</div>
		<template #footer>
			<div class="flex justify-end gap-x-2">
				<Button label="Cancel" icon="pi pi-times" outlined @click="staffAddDialogVisible = false" severity="danger" />
				<Button label="Add staff" icon="pi pi-check" outlined severity="success" @click="handleRegisterStaff()" />
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import SelectButton from 'primevue/selectbutton';
import { SignUpRoles } from '../../login/mappings';
import patientService from '@/src/services/PatientService/PatientService';
import staffService from '@/src/services/StaffService/StaffService';
import { Staff } from '@/src/services/StaffService/interfaces';
import { FreeSchedule, Patient } from '@/src/services/PatientService/interfaces';
import Paginator from 'primevue/paginator';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import dayjs, { Dayjs } from 'dayjs';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import scheduleService from '@/src/services/ScheduleService/ScheduleService';
import Dialog from 'primevue/dialog';
import FreeScheduleComponent from '../FreeScheduleComponent.vue';
import DatePicker from 'primevue/datepicker';
import reportService from '@/src/services/ReportService/ReportService';
import Tag from 'primevue/tag';
import { Appointment } from '@/src/services/AppointmentService/interfaces';
import registerService from '@/src/services/RegisterService/RegisterService';
import InputTextWrapper from '../../utils/InputTextWrapper.vue';
import Select from 'primevue/select';
import { Department } from '@/src/services/DepatmentsService/interfaces';
import departmentService from '@/src/services/DepatmentsService/DepartmentsService';

const confirm = useConfirm();
const toast = useToast();

const signUpRole = ref(SignUpRoles.PATIENT);
const signUpRoles = computed(() => Object.values(SignUpRoles));

const loading = ref(false);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

const generateDate = (date: Dayjs) => {
  return `${date.format('MMM D, YYYY')}`;
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

watch([page, paginatorRows], async () => {
	if (signUpRole.value === SignUpRoles.PATIENT) {
		await fetchAllPatients();
	} else {
		await fetchAllStaff();
	}
})

watch(signUpRole, async () => {
	page.value = 1;

	if (signUpRole.value === SignUpRoles.PATIENT) {
		await fetchAllPatients();
	} else {
		await fetchAllStaff();
	}
})

const patientsData = ref<Patient[]>([]);

const fetchAllPatients = async () => {
	loading.value = true;
	
	const response = await patientService.getAllPatients(
		{ page: page.value, limit: paginatorRows.value }, 
		() => console.log('fetchErrror')
	);

	patientsData.value = response.results.map((patient) => ({
		...patient,
		date_of_birth: dayjs(patient.date_of_birth).add(7, 'hour')
	}));

	console.log('patientsData', patientsData.value);

	totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
}

const staffData = ref<Staff[]>([]);

const fetchAllStaff = async () => {
	loading.value = true;
	
	const response = await staffService.getAllStaffs(
		{ page: page.value, limit: paginatorRows.value }, 
		() => console.log('fetchErrror')
	);

	staffData.value = response.results;

	console.log('staffData', staffData.value);

	totalRecords.value = response?.pagination.totalRecords ?? 0;
	totalPages.value = response?.pagination.totalPages ?? 0;
	loading.value = false;
}

const printGender = (gender: string) => {
	if (gender === 'M') {
		return 'Male';
	} else if (gender === 'F') {
		return 'Female';
	} else {
		return 'Other';
	}
}

const printJobType = (jobType: string) => {
	if (jobType === 'D') {
		return 'Doctor';
	} else {
		return 'Nurse';
	}
}

const userId = ref(0);

const handleDeletePatient = async () => {
	await patientService.deletePatient(
		userId.value,
		() => {
			toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted.', life: 3000 });
			fetchAllPatients();
		},
		() => toast.add({ severity: 'error', summary: 'Error', detail: 'Record not deleted.', life: 3000 })
	);
};

const handleDeleteStaff = async () => {
	await staffService.deleteStaff(
		userId.value,
		() => {
			toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted.', life: 3000 });
			fetchAllStaff();
		},
		() => toast.add({ severity: 'error', summary: 'Error', detail: 'Record not deleted.', life: 3000 })
	);
};

const confirmDelete = (event: Event) => {
	confirm.require({
		target: event.currentTarget as HTMLElement,
		message: 'Do you want to delete this user?',
		icon: 'pi pi-info-circle',
		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
			outlined: true
		},
		acceptProps: {
			label: 'Delete',
			severity: 'danger'
		},
		accept: () => {
			(signUpRole.value === SignUpRoles.PATIENT) ? handleDeletePatient() : handleDeleteStaff();
		},
		reject: () => {}
	});
};

const doctorSchedules = ref<FreeSchedule[]>([]);
const chosenTimes = ref<{ schedule_date: Dayjs; slot: number } | null>();
const scheduleDialogVisible = ref(false);

const fetchChosenDoctorSchedule = async (id: number) => {
  const response = await scheduleService.getFreeScheduleById(
    id,
    (errorId) => {}
  )

  doctorSchedules.value = response.results.map(item => Object({
    ...item,
    schedule_date: dayjs(item.schedule_date).add(7, 'hour'),
  }));
}

const reportDialogVisible = ref(false);
const reportLoading = ref(false);
const reportStartDate = ref<Date | null>();
const reportEndDate = ref<Date | null>();
const reportEmail = ref('');

const reportAppointmentsData = ref<Appointment[]>([]);

watch(reportDialogVisible, (newVal: boolean) => {
	if (!newVal) {
		reportStartDate.value = null;
		reportEndDate.value = null;
		reportEmail.value = '';
		reportAppointmentsData.value = [];
	}
});

const staffReport = ref('Job Change History');

watch([reportStartDate, reportEndDate, staffReport], async () => {
	if (reportStartDate.value && reportEndDate.value) {
		if (signUpRole.value === SignUpRoles.PATIENT) {
			await fetchPatientTreatmentRecordReport();
		} else {
			if (staffReport.value === 'Job Change History') {
				await fetchStaffJobChangeHistory();
			} else if (staffReport.value === 'Staff History') {
				await fetchStaffHistory();
			}
		}
	}
});

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchPatientTreatmentRecordReport = async () => {
	if (!reportEmail.value || !reportStartDate.value || !reportEndDate.value) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
		return;
	}

	reportLoading.value = true;

	const response = await reportService.getPatientTreatmentRecordReport(
		{ email: reportEmail.value, start_date: formatDate(reportStartDate.value), end_date: formatDate(reportEndDate.value) },
		() => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t fetch the report.', life: 5000 })
	);

	reportAppointmentsData.value = response.results.map(item => ({
		...item,
		treatment_date: dayjs(item.treatment_date).add(7, 'hour'),
	}));

	reportLoading.value = false;
}

const reportStaffHistoryData = ref([]);

const fetchStaffHistory = async () => {
	if (!reportEmail.value || !reportStartDate.value || !reportEndDate.value) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
		return;
	}

	reportLoading.value = true;

	const response = await reportService.getStaffHistory(
		{ email: reportEmail.value, start_date: formatDate(reportStartDate.value), end_date: formatDate(reportEndDate.value) },
		() => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t fetch the report.', life: 5000 })
	);

	reportStaffHistoryData.value = response.results.map(item => ({
		...item,
		schedule_date: dayjs(item.schedule_date).add(7, 'hour'),
	}));
	console.log(response.results, reportAppointmentsData.value);

	reportLoading.value = false;
}

const reportStaffJobChangeData = ref([]);

const fetchStaffJobChangeHistory = async () => {
	if (!reportEmail.value || !reportStartDate.value || !reportEndDate.value) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
		return;
	}

	reportLoading.value = true;

	const response = await reportService.getStaffJobChange(
		{ email: reportEmail.value, start_date: formatDate(reportStartDate.value), end_date: formatDate(reportEndDate.value) },
		() => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t fetch the report.', life: 5000 })
	);

	reportStaffJobChangeData.value = response.results.map(item => ({
		...item,
		schedule_date: dayjs(item.schedule_date).add(7, 'hour'),
	}));
	console.log(response.results, reportAppointmentsData.value);

	reportLoading.value = false;
}

const departmentsData = ref<Department[]>([])
	const fetchDepartmentData = async () => {
  departmentsData.value = await departmentService.getAllDepartments((errorMsg) => console.log(errorMsg));
}

const staffAddDialogVisible = ref(false);

const currentStaffEmail = ref('');
const currentStaffPassword = ref('');
const currentStaffFirstName = ref('');
const currentStaffLastName = ref('');
const currentJobType = ref();
const currentGender = ref();
const currentDepartment = ref<Department | null>();

const validate = () => {
	if (!currentStaffEmail.value.endsWith('@hospital.management.com')) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Email must end with @hospital.management.com' });
		return false;
	}

	if (!currentStaffEmail.value || !currentStaffPassword.value || !currentStaffFirstName.value || !currentStaffLastName.value || !currentJobType.value || !currentGender.value || !currentDepartment.value) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
		return false;
	}

	return true;
}

const handleRegisterStaff = async () => {
	if (!validate()) {
		return;
	}

	await registerService.registerStaff(
		currentStaffEmail.value, currentStaffPassword.value, currentStaffFirstName.value, currentStaffLastName.value, currentJobType.value.code, currentGender.value.code, currentDepartment.value?.department_id ?? 0,
		() => {
			toast.add({ severity: 'success', summary: 'Success', detail: 'Staff added successfully' });
			staffAddDialogVisible.value = false;
			fetchAllStaff();

			currentStaffEmail.value = '';
			currentStaffPassword.value = '';
			currentStaffFirstName.value = '';
			currentStaffLastName.value = '';
			currentJobType.value = null;
		},
		() => {
			toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add staff' });
		}
	);
}

onMounted(async () => {
	await fetchAllPatients();
	await fetchDepartmentData();
});

</script>