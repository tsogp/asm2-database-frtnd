<template>
  <div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="appointmentData" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">My Appointments</span>
            <Button icon="pi pi-refresh" rounded raised @click="fetchAppointmentData()" />
          </div>
        </template>
        <Column field="department_name" header="Department"></Column>
        <Column field="staff_name" header="Specialist Name">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar :image="`data:image/jpeg;base64,${staffAvatars.get(data.staff_id)?.base64 ?? ''}`"
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
              :severity="data.is_overdue === 'Cancelled' ? 'danger' : data.is_overdue === 'Past' ? 'info' : 'success'"
              :value="data.is_overdue" />
          </template>
        </Column>
        <Column field="purpose" header="Purpose"></Column>
        <Column header="Treatments">
          <template #body="{ data, frozenRow, index }">
            <Button icon="pi pi-ellipsis-h" severity="secondary" outlined
              @click="() => { currentTreatmentIndex = index; treatmentDialogVisible = true; }"></Button>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data, frozenRow, index }">
            <div class="flex flex-row gap-x-2">
              <Button icon="pi pi-file-edit" outlined severity="info" aria-label="Edit"
                @click="() => { 
                  currentAppointmentIndex = index; 
                  editDialogVisible = true; 
                  dateToBeEdited = data.date; 
                  slotOfDateToBeEdited = data.slot_number; 
                }"
                :disabled="data.is_overdue === 'Cancelled'" />
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
  <Dialog v-model:visible="treatmentDialogVisible" header="Related Treatments" :style="{ width: '75vw' }" modal
    :contentStyle="{ height: '300px' }">
    <DataTable :value="appointmentData.at(currentTreatmentIndex)?.treatments ?? []" scrollable scrollHeight="flex"
      tableStyle="min-width: 50rem">
      <Column field="name" header="Name"></Column>
      <Column field="date" header="Date"></Column>
      <Column header="Is Overdue">
        <template #body="{ data }">
          <Tag :severity="data.is_overdue === 'Cancelled' ? 'danger' : data.is_overdue === 'Past' ? 'info' : 'success'"
            :value="data.is_overdue" />
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <Button label="Ok" icon="pi pi-check" @click="treatmentDialogVisible = false" />
    </template>
  </Dialog>
  <Dialog v-model:visible="editDialogVisible" header="Edit Appointment Date" modal>
    <p class="text-xl font-semibold">Current appointment date: </p>
    <p class="text-xl font-semibold">{{ generateDate(dateToBeEdited, slotOfDateToBeEdited) }}</p>
    <p class="text-xl font-semibold">Choose one of the available dates:</p>
    <Button @click="async () => await fetchScheduleData(appointmentData.at(currentAppointmentIndex)?.staff_id ?? 0)" />
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" outlined severity="danger" @click="editDialogVisible = false" />
      <Button label="Save" icon="pi pi-bookmark" outlined @click="editDialogVisible = false" />
    </template>
  </Dialog>
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
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Paginator from 'primevue/paginator';
import appointmentService from '@/src/services/AppointmentService/AppointmentService';
import { Treatment } from '@/src/services/AppointmentService/interfaces';
import dayjs, { Dayjs } from 'dayjs';
import Button from 'primevue/button';
import utc from 'dayjs/plugin/utc'
import Tag from 'primevue/tag';
import { onMounted, ref, watch } from 'vue';
import fileService from '@/src/services/FileService/FileService';
import { VisibleAppointment } from './interfaces';
import { AvatarResponse } from '@/src/services/FileService/interfaces';
import { useToast } from 'primevue/usetoast';
import loginService from '@/src/services/LoginService/LoginService';
import staffScheduleService from '@/src/services/StaffService/StaffScheduleService';

const appointmentData = ref<VisibleAppointment[]>([]);
const staffAvatars = ref<Map<number, AvatarResponse>>(new Map<number, AvatarResponse>());
dayjs.extend(utc);

const toast = useToast();

const loading = ref(true);

const getOccupation = (occupation: string) => {
  return (occupation == 'D') ? 'Doctor' : 'Nurse';
}

const getStatus = (date: Dayjs, status?: string) => {
  return status !== 'C'
    ? dayjs(date).isBefore(dayjs())
      ? 'Past'
      : 'Upcoming'
    : 'Cancelled';
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

watch(page, () => fetchAppointmentData());
watch(paginatorRows, () => fetchAppointmentData());

onMounted(() => {
  fetchAppointmentData();
})

const fetchStaffAvatars = async () => {
  const staffIds: Set<number> = new Set<number>();

  appointmentData.value.forEach(element => {
    staffIds.add(element.staff_id);
  });

  const promises = Array.from(staffIds.values()).map(element =>
    fileService.getStaffAvatar(
      { mysql_id: element, type: 'Avatar' },
      () => console.log(`failed fetching for ${element}`)
    ).then(result => [element, result])
  );

  staffAvatars.value = new Map<number, AvatarResponse>(
    // @ts-ignore
    await Promise.all(promises)
  );

  console.log(staffAvatars.value)
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
      treatments: JSON.parse(item.treatments).map((it: Treatment) => ({
        ...it,
        is_overdue: getStatus(it.date),
        date: dayjs(it.date).utc().format('MMM D, YYYY'),
      })) ?? [],
      date: dayjs(item.schedule_date).utc().hour(getTimeSlotHour(item.slot_number)),
      slot_number: item.slot_number,
      job_type: getOccupation(item.job_type),
      is_overdue: getStatus(item.schedule_date, item.status),
      staff_name: item.staff_first_name + ' ' + item.staff_last_name,
    }));

  await fetchStaffAvatars();

  totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
  console.log(response)
}

const fetchScheduleData = async (staff_id: number) => {
  await staffScheduleService.getStaffSchedule({staff_id}, (errorMsg) => console.log('failed to fetch the doctor schedule'));
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