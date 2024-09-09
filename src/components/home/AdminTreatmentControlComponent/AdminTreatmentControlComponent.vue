<template>
<DataTable :value="allTreatmentData" :loading="loading">
	<template #empty>
		<div class="p-4 text-center">
			<span class="text-lg">No treatment menus found.</span>
		</div>
	</template>
	<template #header>
		<div class="flex flex-wrap items-center justify-between gap-2">
			<span class="text-xl font-bold">Treatment Menus</span>	
			<div class="flex flex-row gap-x-2">
				<Button icon="pi pi-plus" rounded raised @click="() => {
					createDialogVisible = true;
					currentTreatmentName = '';
					currentTreatmentCost = 0;
				}" />
				<Button icon="pi pi-refresh" rounded raised @click="fetchAllTreatments()" />
			</div>
		</div>
	</template>
	<Column field="treatment_id" header="ID"></Column>
	<Column field="treatment_cost" header="Cost"></Column>
	<Column field="treatment_name" header="Name"></Column>
	<Column header="Actions">
		<template #body="{ data, frozenRow, index }">
			<Button icon="pi pi-pencil" outlined @click="currentTreatmentIndex = index; editDialogVisible = true;" />
		</template>
	</Column>
</DataTable>
<Dialog v-model:visible="editDialogVisible" header="Edit Treatment Menu" modal>
	<InputTextWrapper 
		v-model="currentTreatmentName" 
		id="treatment_name" 
		type="text" 
		placeholder="Treatment Name"  
		label="Enter new treatment name"
		:is-required="true"
	/>
	<InputTextWrapper 
		v-model="currentTreatmentCost" 
		id="treatment_cost" 
		type="number" 
		placeholder="Treatment Cost"  
		label="Enter new treatment cost"
		:is-required="true"
	/>
	<template #footer>
		<div class="flex justify-end gap-x-2">
			<Button label="Cancel" icon="pi pi-times" outlined @click="editDialogVisible = false" severity="danger" />
			<Button label="Update treatment" icon="pi pi-check" outlined severity="success" @click="handleUpdateTreatment()" />
		</div>
	</template>
</Dialog>
<Dialog v-model:visible="createDialogVisible" header="Add Treatment Menu" modal>
	<InputTextWrapper 
		v-model="currentTreatmentName" 
		id="treatment_name" 
		type="text" 
		placeholder="Treatment Name"  
		label="Enter new treatment name"
		:is-required="true"
	/>
	<InputTextWrapper 
		v-model="currentTreatmentCost" 
		id="treatment_cost" 
		type="number" 
		placeholder="Treatment Cost"  
		label="Enter new treatment cost"
		:is-required="true"
	/>
	<template #footer>
		<div class="flex justify-end gap-x-2">
			<Button label="Cancel" icon="pi pi-times" outlined @click="editDialogVisible = false" severity="danger" />
			<Button label="Create treatment" icon="pi pi-check" outlined severity="success" @click="handleCreateNewTreatment()" />
		</div>
	</template>
</Dialog>
</template>

<script setup lang="ts">
import { TreatmentMenu } from '@/src/services/TreatmentMenuService/interfaces';
import treatmentMenuService from '@/src/services/TreatmentMenuService/TreatmentMenuService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { onMounted, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputTextWrapper from '../../utils/InputTextWrapper.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const loading = ref(false);

const allTreatmentData = ref<TreatmentMenu[]>([]);

const fetchAllTreatments = async () => {
	loading.value = true;

	const response = await treatmentMenuService.getAllTreatmentMenus(
		() => console.log('fetchErrror')
	);

	allTreatmentData.value = response.results;

	loading.value = false;
}

const editDialogVisible = ref(false);
const currentTreatmentIndex = ref<number>(-1);
const currentTreatmentName = ref<string>('');
const currentTreatmentCost = ref<number>(0);

watch (currentTreatmentIndex, (newVal: number) => {
	currentTreatmentName.value = allTreatmentData.value[newVal].treatment_name;
	currentTreatmentCost.value = Number(allTreatmentData.value[newVal].treatment_cost);
})

const handleUpdateTreatment = async () => {
	if (currentTreatmentName.value === '') {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Treatment name cannot be empty' });
		return;
	}

	if (currentTreatmentCost.value === 0) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Treatment cost cannot be empty' });
		return;
	}

	await treatmentMenuService.editTreatmentMenu(
		{treatment_id: allTreatmentData.value.at(currentTreatmentIndex.value)?.treatment_id ?? 0, treatment_name: currentTreatmentName.value, treatment_cost: currentTreatmentCost.value},
		() => {
			toast.add({ severity: 'success', summary: 'Success', detail: 'Treatment updated successfully' });
			editDialogVisible.value = false;
			fetchAllTreatments();
		}, 
		() => {
			toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update treatment' });
		}
	);
}

const createDialogVisible = ref(false);

const handleCreateNewTreatment = async () => {
	if (currentTreatmentName.value === '') {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Treatment name cannot be empty' });
		return;
	}

	if (currentTreatmentCost.value === 0) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Treatment cost cannot be empty' });
		return;
	}

	await treatmentMenuService.addTreatmentMenu(
		{treatment_name: currentTreatmentName.value, treatment_cost: currentTreatmentCost.value},
		() => {
			toast.add({ severity: 'success', summary: 'Success', detail: 'Treatment created successfully' });
			createDialogVisible.value = false;
			fetchAllTreatments();
		}, 
		() => {
			toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create treatment' });
		}
	);
}

onMounted(async () => {
	await fetchAllTreatments();
})
</script>