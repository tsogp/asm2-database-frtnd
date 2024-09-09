<template>
  <div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="appointmentData" tableStyle="min-width: 50rem" :loading="loading">
        <template #empty>
          <div class="p-4 text-center">
            <span class="text-lg">No appointments yet.</span>
          </div>
        </template>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">My Appointments</span>
            <div class="flex flex-row gap-x-2">
              <Button icon="pi pi-plus" rounded raised @click="createAppointmentDialogVisible = true;" />
              <Button icon="pi pi-refresh" rounded raised @click="fetchAppointmentData()" />
            </div>
          </div>
        </template>
        <Column field="department_name" header="Department"></Column>
        <Column field="staff_name" header="Specialist Name">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar :image="`data:image/${staffAvatars.get(data.staff_id)?.filename.split('.')[1]};base64,${staffAvatars.get(data.staff_id)?.base64 ?? ''}`"
                shape="circle" />
              <span>{{ data.staff_name }}</span>
            </div>
          </template>
        </Column>
        <Column field="job_type" header="Specialist Type"></Column>
        <Column field="date" header="Date">
          <template #body="{ data }">
            {{ generateDate(data.date, data.slot_number) }}
          </template>
        </Column>
        <Column field="is_overdue" header="Status">
          <template #body="{ data }">
            <Tag 
              :severity="getTicketSeverity(data.is_overdue)" 
              :value="getTicketStatusName(data.is_overdue)" />
          </template>
        </Column>
        <Column field="purpose" header="Purpose"></Column>
        <Column header="Treatments">
          <template #body="{ data, frozenRow, index }">
            <Button icon="pi pi-ellipsis-h" severity="secondary" outlined
              @click="() => { 
                currentTreatmentIndex = index; 
                treatmentDialogVisible = true; 
                fetchTreatmentDataById(appointmentData.at(currentTreatmentIndex)?.appointment_id ?? 0);
              }"></Button>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data, frozenRow, index }">
            <div class="flex flex-row gap-x-2">
              <!-- <Button icon="pi pi-file-edit" outlined severity="info" aria-label="Edit"
                @click="() => { 
                  currentAppointmentIndex = index; 
                  editDialogVisible = true; 
                  dateToBeEdited = data.date; 
                  slotOfDateToBeEdited = data.slot_number;
                  fetchChosenDoctorSchedule(data.staff_id);
                }"
                :disabled="data.is_overdue === 'Cancelled'" /> -->
              <Button icon="pi pi-times" outlined severity="danger" aria-label="Cancel"
                :disabled="data.is_overdue === 'Cancelled'" @click="() => {
                  currentAppointmentIndex = index;
                  cancelDialogVisible = true;
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
    :contentStyle="{ height: '500px' }">
    <div class="flex flex-col gap-y-2 h-full">
      <DataTable :value="treatmentData" :loading="treatmentLoading" scrollable scrollHeight="flex"
        tableStyle="min-width: 50rem" class="flex-1">
        <template #empty>
          <div class="p-4 text-center">
            <span class="text-lg">No treatments yet.</span>
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
              :severity="getTicketSeverity(data.is_overdue)" 
              :value="getTicketStatusName(data.is_overdue)" />
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
  <!-- <Dialog v-model:visible="editDialogVisible" header="Edit Appointment Date" modal>
    <p class="text-lg font-semibold">Current appointment date: {{ generateDate(dateToBeEdited, slotOfDateToBeEdited) }}</p>
    
    <FreeScheduleComponent
      :schedules="doctorSchedules"
      v-model="chosenTimes"
      v-if="doctorSchedules.length > 0"
      title="Appointment Time"
      :is-required="false"
    />

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" outlined severity="danger" @click="editDialogVisible = false" />
      <Button label="Save" icon="pi pi-bookmark" outlined 
        @click="updateAppointment(appointmentData.at(currentAppointmentIndex)?.appointment_id ?? 0)" />
    </template>
  </Dialog> -->
  <Dialog v-model:visible="cancelDialogVisible" header="Cancel Appointment" modal>
    <p class="text-xl font-semibold">Are you sure you want to cancel this appointment?</p>
    <template #footer>
      <div class="flex flex-row gap-x-2">
        <Button label="Cancel" icon="pi pi-times" outlined @click="cancelDialogVisible = false" />
        <Button label="I am sure" icon="pi pi-check" outlined severity="danger" @click="handleCancelAppointment(
          appointmentData.at(currentAppointmentIndex)?.appointment_id ?? 0,
          loginService.getUserID() ?? 0,
        )" />
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="createAppointmentDialogVisible" header="Book an appointment" modal :style="{ width: '34rem' }">
    <div class="flex flex-col gap-y-1">
      <div class="flex flex-col gap-y-1">
        <div class="flex flex-row items-center gap-x-1">
          <i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
          <label for="dept" class="font-semibold">Department</label>
        </div>
        <Select v-model="newAppointmentDepartment" id="dept" :options="departmentsData" optionLabel="department_name"
          placeholder="Select a Department" class="w-full min-w-[70px]" />
        <div class="text-red-500 text-xs font-semibold" v-if="newAppointmentDepartmentError">{{ newAppointmentDepartmentError }}</div>
      </div>
      
      <div class="flex flex-col gap-y-1">
        <div class="flex flex-row items-center gap-x-1">
          <i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
          <label for="dept" class="font-semibold">Doctor</label>
        </div>
        <Select 
          v-model="newAppointmentDoctor" 
          :options="doctorsData" 
          optionLabel="full_name" 
          placeholder="Select a Doctor" 
          class="w-full" 
          :disabled="!newAppointmentDepartment || doctorsLoading" 
          :loading="doctorsLoading"
        />
      </div>

      <FreeScheduleComponent
        :schedules="doctorSchedules"
        v-model="chosenTimes"
        v-if="doctorSchedules.length > 0"
        title="Appointment Time"
        :is-required="true"
      />

      <InputTextWrapper 
        v-model="newAppointmentNote" 
        id="email" 
        type="text" 
        placeholder="Note"  
        label="Enter your symploms/concerns"
        :is-required="true"
      />
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" outlined severity="danger" @click="createAppointmentDialogVisible = false" />
      <Button label="Create an appointment" icon="pi pi-bookmark" outlined @click="() => createNewAppointment()" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Paginator from 'primevue/paginator';
import appointmentService from '@/src/services/AppointmentService/AppointmentService';
import { Treatment } from '@/src/services/AppointmentService/interfaces';
import InputTextWrapper from '../../utils/InputTextWrapper.vue';
import dayjs, { Dayjs } from 'dayjs';
import Button from 'primevue/button';
import utc from 'dayjs/plugin/utc'
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import { onMounted, ref, watch } from 'vue';
import fileService from '@/src/services/FileService/FileService';
import { VisibleAppointment } from './interfaces';
import { AvatarResponse } from '@/src/services/FileService/interfaces';
import { useToast } from 'primevue/usetoast';
import loginService from '@/src/services/LoginService/LoginService';
import staffScheduleService from '@/src/services/StaffService/StaffService';
import treatmentRecordService from '@/src/services/TreatmentRecordService/TreatmentRecordService';
import { Department, Doctor } from '@/src/services/DepatmentsService/interfaces';
import departmentService from '@/src/services/DepatmentsService/DepartmentsService';
import scheduleService from '@/src/services/ScheduleService/ScheduleService';
import { FreeSchedule } from '@/src/services/PatientService/interfaces';
import FreeScheduleComponent from '../FreeScheduleComponent.vue';

const appointmentData = ref<VisibleAppointment[]>([]);
const staffAvatars = ref<Map<number, AvatarResponse>>(new Map<number, AvatarResponse>());
dayjs.extend(utc);

const toast = useToast();

const loading = ref(true);

const getOccupation = (occupation: string) => {
  return (occupation == 'D') ? 'Doctor' : 'Nurse';
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

const getTimeSlotHour = (slot: number) => {
  // don't ask
  return slot + 8;
}

const generateDate = (date: Dayjs, slot: number) => {
  const slotHour = getTimeSlotHour(slot);

  return `${date.format('MMM D, YYYY H:mm')} - ${slotHour + 1}:00`;
}

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

const treatmentDialogVisible = ref(false);
const currentTreatmentIndex = ref(0);

const editDialogVisible = ref(false);
const currentAppointmentIndex = ref(0);

const dateToBeEdited = ref<Dayjs>(dayjs());
const slotOfDateToBeEdited = ref(0);

const cancelDialogVisible = ref(false);

const treatmentLoading = ref(false);
const treatmentData = ref<Treatment[]>([]);

const treatmentPage = ref(1);
const treatmentPaginatorRows = ref(5);
const treatmentTotalRecords = ref(0);
const treatmentTotalPages = ref(0);

const createAppointmentDialogVisible = ref(false);

watch(page, () => fetchAppointmentData());
watch(paginatorRows, () => fetchAppointmentData());

watch(treatmentPage, () => fetchTreatmentDataById(appointmentData.value.at(currentTreatmentIndex.value)?.appointment_id ?? 0));
watch(treatmentPaginatorRows, () => fetchTreatmentDataById(appointmentData.value.at(currentTreatmentIndex.value)?.appointment_id ?? 0));

onMounted(() => {
  fetchAppointmentData();
  fetchDepartmentData();
})

const departmentsData = ref<Department[]>([]);
const newAppointmentDepartment = ref<Department | null>();
const newAppointmentDepartmentError = ref<string | null>();
const doctorsData = ref<Doctor[]>([]);
const doctorsLoading = ref(false);
const newAppointmentDoctor = ref<Doctor>();
const newAppointmentNote = ref<string>();

const doctorSchedules = ref<FreeSchedule[]>([]);
const chosenTimes = ref<{ schedule_date: Dayjs; slot: number } | null>();

watch(newAppointmentDoctor, () => {
  if (newAppointmentDoctor.value) {
    fetchChosenDoctorSchedule(newAppointmentDoctor.value.staff_id);
  }
})

const fetchChosenDoctorSchedule = async (id: number) => {
  const response = await scheduleService.getFreeScheduleById(
    id,
    (errorId) => {}
  )

  doctorSchedules.value = response.results.map(item => Object({
    ...item,
    schedule_date: dayjs(item.schedule_date),
  }));
}

watch(newAppointmentDepartment, () => {
  doctorsLoading.value = true;
  newAppointmentDoctor.value = undefined;
  fetchDoctorData()
  doctorsLoading.value = true;
});

const createNewAppointment = async () => {
  if (
    !(newAppointmentDepartment.value && newAppointmentDoctor.value && chosenTimes.value && newAppointmentNote.value && chosenTimes.value)
  ) {
    toast.add({ severity: 'error', summary: 'Failure', detail: 'Fill up all the information before booking appointment.', life: 5000 });
    return;
  }

  await appointmentService.bookAppointment(
    {
      patientID: loginService.getUserID() ?? 0,
      doctorID: newAppointmentDoctor.value?.staff_id ?? 0,
      date: chosenTimes.value?.schedule_date.add(1, 'day').toISOString().split('T')[0] ?? '',
      slotNumber: chosenTimes.value?.slot ?? 0,
      purpose: newAppointmentNote.value ?? '',
    },
    async () => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Appointment booked successfully.', life: 5000 });
      createAppointmentDialogVisible.value = false;
      newAppointmentDepartment.value = null;
      fetchAppointmentData();
    },
    () => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t book the appointment.', life: 5000 })
  )
}

const updateAppointment = async (appointmentId: number) => {
  if (
    !(chosenTimes.value)
  ) {
    toast.add({ severity: 'error', summary: 'Failure', detail: 'Fill up all the information before booking appointment.', life: 5000 });
    return;
  }

  await appointmentService.updateAppointment(
    {
      appointmentId: appointmentId,
      date: chosenTimes.value?.schedule_date.add(1, 'day').toISOString().split('T')[0] ?? '',
      timeSlot: chosenTimes.value?.slot ?? 0,
    },
    async () => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Appointment updated successfully.', life: 5000 });
      editDialogVisible.value = false;
      chosenTimes.value = null;
      fetchAppointmentData();
    },
    () => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t update the appointment.', life: 5000 })
  )
}

watch(doctorsData, () => {
  doctorSchedules.value = [];
})

const fetchDepartmentData = async () => {
  departmentsData.value = await departmentService.getAllDepartments((errorMsg) => console.log(errorMsg));
}

const getTreatmentStatus = (status: string) => {
  return status === 'U' ? 'Upcoming' : 'Cancelled';
}

const fetchStaffAvatars = async () => {
  const staffIds: Set<number> = new Set<number>();  

  appointmentData.value.forEach(element => {
    staffIds.add(element.staff_id);
  });

  const promises = Array.from(staffIds.values()).map(element =>
    fileService.getStaffAvatar(
      { mysql_id: element },
      () => console.log(`failed fetching for ${element}`)
    ).then(result => [element, result])
  );

  staffAvatars.value = new Map<number, AvatarResponse>(
    // @ts-ignore
    await Promise.all(promises)
  );
}

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

const fetchDoctorData = async () => {
  doctorsLoading.value = true;

  const response = await departmentService.getAllDoctorsByDepartment(
    {
      department_id: newAppointmentDepartment.value?.department_id ?? 0,
      page: 1,
      limit: 50
    }, (errorMsg) => console.log(errorMsg));

  doctorsData.value = response.results.map((item: Doctor) => Object({
    ...item,
    job_type: getOccupation(item.job_type),
    full_name: item.first_name + ' ' + item.last_name,
  }));

  doctorsLoading.value = false;
}

const fetchAppointmentData = async () => {
  loading.value = true;
  const response = await appointmentService.getPatientsAppointments({ page: page.value, limit: paginatorRows.value }, () => console.log('fetchErrror'));

  appointmentData.value =
    (response?.results ?? []).map((item) => ({
      staff_id: item.staff_id,
      purpose: item.purpose,
      department_name: item.department_name,
      appointment_id: item.appointment_id,
      date: dayjs(item.schedule_date).hour(getTimeSlotHour(item.slot_number)),
      slot_number: item.slot_number,
      job_type: getOccupation(item.job_type),
      is_overdue: item.status,
      staff_name: item.staff_first_name + ' ' + item.staff_last_name,
    }));

  await fetchStaffAvatars();

  totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
  console.log(response)
}

const handleCancelAppointment = async (appointment_id: number, patient_id: number) => {
  await appointmentService.cancelAppointment(
    {
      appointment_id,
      patient_id,
    },
    () => toast.add({ severity: 'success', summary: 'Success', detail: 'Appointment cancelled successfully.', life: 5000 }),
    () => toast.add({ severity: 'error', summary: 'Failure', detail: 'Couldn\'t cancel the appointment.', life: 5000 })
  )

  cancelDialogVisible.value = false;
  fetchAppointmentData();
}

</script>