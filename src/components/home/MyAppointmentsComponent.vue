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
              <Avatar
                :image="`data:image/jpeg;base64,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`"
                shape="circle" />
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
  appointmentData.value =
    (response?.results ?? [])
      .map(item => Object({
        purpose: item.purpose,
        department_name: item.department_name,
        appointment_id: item.appointment_id,
        treatments: JSON.parse(item.treatments).map(it => Object({
          ...it,
          is_overdue: getStatus(it.date),
          date: dayjs(it.date).utc().format('MMM D, YYYY h:mm A'),
        })) ?? [],
        date: dayjs(item.schedule_date).utc().hour(getTimeSlotHour(item.slot_number)).utcOffset(7).format('MMM D, YYYY h:mm A'),
        job_type: getOccupation(item.job_type),
        is_overdue: getStatus(item.schedule_date),
        staff_name: item.staff_first_name + ' ' + item.staff_last_name,
      }));

  totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
  console.log(response)
}

</script>