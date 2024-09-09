<template>
<div class="flex-1 overflow-y-auto">
	<div class="card">
		<DataTable :value="departmentsData" :loading="loading">
			<template #empty>
				<div class="p-4 text-center">
					<span class="text-lg">No departments yet.</span>
				</div>
			</template>
			<template #header>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<span class="text-xl font-bold">Departments</span>
					<div class="flex flex-row gap-x-2">
						<Button icon="pi pi-refresh" rounded raised @click="fetchDepartmentData()" />
					</div>
				</div>
			</template>
			<Column field="department_id" header="ID"></Column>
			<Column field="department_name" header="Department Name"></Column>
			<Column header="Update">
				<template #body="{ data, frozenRow, index }">
					<Button icon="pi pi-pencil" outlined @click="currentDepartmentIndex = index; createEditDialogVisible = true; console.log(currentDepartmentIndex)" />
				</template>
			</Column>
		</DataTable>
	</div>
</div>
<Dialog v-model:visible="createEditDialogVisible" header="Edit Department" modal>
	<InputTextWrapper 
		v-model="currentDepartmentName" 
		id="department_name" 
		type="text" 
		placeholder="Note"  
		label="Enter new department name"
		:is-required="true"
	/>
	<template #footer>
		<div class="flex justify-end gap-x-2">
			<Button label="Cancel" icon="pi pi-times" outlined @click="createEditDialogVisible = false" severity="danger" />
			<Button label="Update department" icon="pi pi-check" outlined severity="success" @click="handleUpdateDepartment()" />
		</div>
	</template>
</Dialog>
</template>

<script setup lang="ts">
import departmentService from '@/src/services/DepatmentsService/DepartmentsService';
import { Department, Doctor } from '@/src/services/DepatmentsService/interfaces';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import InputTextWrapper from '../../utils/InputTextWrapper.vue';

const toast = useToast();
const departmentsData = ref<Department[]>([]);

const loading = ref(false);

const fetchDepartmentData = async () => {
	loading.value = true;
  departmentsData.value = await departmentService.getAllDepartments((errorMsg) => console.log(errorMsg));
	loading.value = false;
}

const createEditDialogVisible = ref(false);
const currentDepartmentIndex = ref<number>(-1);
const currentDepartmentName = ref<string>('');

watch (currentDepartmentIndex, (newVal: number) => {
	currentDepartmentName.value = departmentsData.value[newVal].department_name;
})

const handleUpdateDepartment = async () => {
	if (currentDepartmentName.value === '') {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Department name cannot be empty' });
		return;
	}

	await departmentService.updateDepartment(
		{department_id: departmentsData.value.at(currentDepartmentIndex.value)?.department_id ?? 0, department_name: currentDepartmentName.value},
		() => {
			toast.add({ severity: 'success', summary: 'Success', detail: 'Department updated successfully' });
			createEditDialogVisible.value = false;
			fetchDepartmentData();
		}, 
		(errorMsg) => {
			toast.add({ severity: 'error', summary: 'Error', detail: errorMsg });
		});
}

onMounted(async () => {
	await fetchDepartmentData();
})

</script>