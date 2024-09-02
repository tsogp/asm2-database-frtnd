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
              <Avatar :image="`data:image/jpeg;base64,${data.imgSrc.base64}`" shape="circle" />
              <span>{{ data.staff_name }}</span>
            </div>
          </template>
        </Column>
        <Column field="job_type" header="Specialist Type"></Column>
        <Column field="date" header="Date"></Column>
        <Column field="is_overdue" header="Is Overdue">
          <template #body="{ data }">
            <Tag :severity="data.is_overdue == 'Past' ? 'info' : 'success'" :value="data.is_overdue" />
          </template>
        </Column>
        <Column field="purpose" header="Purpose"></Column>
        <Column header="Treatments">
          <template #body="{ data, frozenRow, index }">
            <Button icon="pi pi-ellipsis-h" severity="secondary" outlined
              @click="() => { currentTreatmentIndex = index; dialogVisible = true; }"></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="(data) => page = data.page + 1"></Paginator>
  <Dialog v-model:visible="dialogVisible" header="Related Treatments" :style="{ width: '75vw' }" modal
    :contentStyle="{ height: '300px' }">
    <DataTable :value="appointmentData?.at(currentTreatmentIndex)?.treatments ?? []" scrollable scrollHeight="flex"
      tableStyle="min-width: 50rem">
      <Column field="name" header="Name"></Column>
      <Column field="date" header="Date"></Column>
      <Column header="Is Overdue">
        <template #body="{ data }">
          <Tag :severity="data.is_overdue == 'Past' ? 'info' : 'success'" :value="data.is_overdue" />
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <Button label="Ok" icon="pi pi-check" @click="dialogVisible = false" />
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
import { Appointment } from '@/src/services/AppointmentService/interfaces';
import dayjs, { Dayjs } from 'dayjs';
import Button from 'primevue/button';
import utc from 'dayjs/plugin/utc'
import Tag from 'primevue/tag';
import { onMounted, ref, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import fileService from '@/src/services/FileService/FileService';

const filters = ref({
  department_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  staff_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
  job_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  is_overdue: { value: null, matchMode: FilterMatchMode.EQUALS },
  purpose: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const appointmentData = ref<Appointment[]>();
dayjs.extend(utc);

const loading = ref(true);

const getOccupation = (occupation: string) => {
  return (occupation == 'D') ? 'Doctor' : 'Nurse';
}

const getStatus = (date: Dayjs) => {
  return dayjs(date).isBefore(dayjs()) ? 'Past' : 'Upcoming';
}

const getTimeSlotHour = (slot: number) => {
  // don't ask
  return slot + 8;
}

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0)

const dialogVisible = ref(false)
const currentTreatmentIndex = ref(0)

watch(page, () => fetchAppointmentData());
watch(paginatorRows, () => fetchAppointmentData());

onMounted(() => {
  fetchAppointmentData();
})

const fetchAppointmentData = async () => {
  loading.value = true;
  const response = await appointmentService.getPatientsAppointments({ page: page.value, limit: paginatorRows.value }, () => console.log('fetchErrror'));

  appointmentData.value = await Promise.all(
    (response?.results ?? []).map(async (item) => ({
      staff_id: item.staff_id,
      purpose: item.purpose,
      department_name: item.department_name,
      appointment_id: item.appointment_id,
      treatments: JSON.parse(item.treatments).map((it) => ({
        ...it,
        is_overdue: getStatus(it.date),
        date: dayjs(it.date).utc().format('MMM D, YYYY'),
      })) ?? [],
      date: dayjs(item.schedule_date).utc().hour(getTimeSlotHour(item.slot_number)).utcOffset(7).format('MMM D, YYYY h:mm A'),
      job_type: getOccupation(item.job_type),
      is_overdue: getStatus(item.schedule_date),
      staff_name: item.staff_first_name + ' ' + item.staff_last_name,
      imgSrc: await fileService.getStaffAvatar(
        { mysql_id: item.staff_id, type: "Avatar" },
        () => console.log('help')
      ) ?? '', // Handle the case where the avatar might not be available
    }))
  );

  totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
  console.log(response)
}

</script>