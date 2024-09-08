<template>
	<div class="m-2 flex flex-col gap-x-2">
		<div>
			<h1 class="text-lg font-semibold">Admin User Control</h1>
		</div>
		<SelectButton 
			v-model="signUpRole" 
			:options="signUpRoles"
			class="w-full"
			:allowEmpty="false"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SelectButton from 'primevue/selectbutton';
import { SignUpRoles } from '../../login/mappings';
import patientService from '@/src/services/PatientService/PatientService';

const signUpRole = ref(SignUpRoles.PATIENT);
const signUpRoles = computed(() => Object.values(SignUpRoles));

const loading = ref(false);

const page = ref(1);
const paginatorRows = ref(5);
const totalRecords = ref(0);
const totalPages = ref(0);

watch([page, paginatorRows], async () => {
	await fetchAllPatients();
})

const fetchAllPatients = async () => {
	loading.value = true;
	
	const response = await patientService.getAllPatients(
		{ page: page.value, limit: paginatorRows.value }, 
		() => console.log('fetchErrror')
	);

	totalRecords.value = response?.pagination.totalRecords ?? 0;
  totalPages.value = response?.pagination.totalPages ?? 0;
  loading.value = false;
}

const fetchAllStaff = async () => {
	loading.value = true;
	
	const response = await staffService.getAllStaff(
		{ page: page.value, limit: paginatorRows.value }, 
		() => console.log('fetchErrror')
	);

	totalRecords.value = response?.pagination.totalRecords ?? 0;
	totalPages.value = response?.pagination.totalPages ?? 0;
	loading.value = false;
}

</script>