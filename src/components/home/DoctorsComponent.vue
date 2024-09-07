<template>
  <div class="mx-4 my-2 flex flex-col gap-y-2">
    <p class="text-xl font-bold">Departments</p>
    <Select v-model="selectedDepartment" :options="departmentsData" optionLabel="department_name"
      placeholder="Select a Department" class="w-full" />
  </div>
  <div class="flex-1 overflow-y-auto">
    <div class="card">
      <DataTable :value="doctorData" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">{{
              selectedDepartment !== null
                ? `Doctors of ${selectedDepartment.department_name.toLowerCase()} department`
                : 'Doctors'
            }}</span>
          </div>
        </template>
        <Column field="department_name" header="Department"></Column>
        <Column field="staff_name" header="Specialist Name">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar :image="`data:image/${staffAvatars.get(data.staff_id)?.filename.split('.')[1]};base64,${staffAvatars.get(data.staff_id)?.base64 ?? ''}`"
                shape="circle" v-if="staffAvatars.get(data.staff_id)?.base64 !== undefined" />
              <Avatar icon="pi pi-user" class="mr-2" size="normal" shape="circle" v-else />  
              <span>{{ data.first_name }} {{ data.last_name }}</span>
            </div>
          </template>
        </Column>
        <Column field="job_type" header="Specialist Type"></Column>
        <Column header="Schedule">
          <template #body="{ data, frozenRow, index }">
            <Button icon="pi pi-ellipsis-h" severity="secondary" outlined></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <Paginator v-model:rows="paginatorRows" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
    @page="(data) => page = data.page + 1"></Paginator>
</template>

<script setup lang="ts">
import departmentService from '@/src/services/DepatmentsService/DepartmentsService';
import { Department, Doctor } from '@/src/services/DepatmentsService/interfaces';
import { onMounted, ref, watch } from 'vue';
import Select from 'primevue/select';
import fileService from '@/src/services/FileService/FileService';
import { AvatarResponse } from '@/src/services/FileService/interfaces';
import Paginator from 'primevue/paginator';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';

const departmentsData = ref<Department[]>([]);
const doctorData = ref<Doctor[]>([]);
const selectedDepartment = ref<Department | null>(null);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

const loading = ref(true);

const fetchDepartmentData = async () => {
  departmentsData.value = await departmentService.getAllDepartments((errorMsg) => console.log(errorMsg));
}

onMounted(async () => {
  await fetchDepartmentData();
  await fetchDoctorData();
  loading.value = false;
})

const staffAvatars = ref<Map<number, AvatarResponse>>(new Map<number, AvatarResponse>());

const fetchStaffAvatars = async () => {
  const staffIds: Set<number> = new Set<number>();

  doctorData.value.forEach(element => {
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

const getOccupation = (occupation: string) => {
  return (occupation == 'D') ? 'Doctor' : 'Nurse';
}

const fetchDoctorData = async () => {
  const response = selectedDepartment.value !== null
    ? await departmentService.getAllDoctorsByDepartment(
      {
        department_id: selectedDepartment.value?.department_id ?? 0,
        page: page.value,
        limit: paginatorRows.value
      }, (errorMsg) => console.log(errorMsg))
    : await departmentService.getAllDoctors(
      {
        page: page.value,
        limit: paginatorRows.value
      }, (errorMsg) => console.log(errorMsg));

  doctorData.value = response.results.map((item: Doctor) => Object({
    ...item,
    job_type: getOccupation(item.job_type)
  }));

  await fetchStaffAvatars();

  loading.value = false;

  totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
}

watch(selectedDepartment, () => {
  fetchDoctorData();
})

watch(page, () => fetchDoctorData());
watch(paginatorRows, () => fetchDoctorData());
</script>