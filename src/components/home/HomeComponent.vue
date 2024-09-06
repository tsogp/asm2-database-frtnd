<template>
	<FullHeightComponent>
    <div class="flex flex-col h-full">
      <HeaderComponent />
      <router-view />
    </div>
	</FullHeightComponent>
</template>

<script setup lang="ts">
import FullHeightComponent from '@/src/components/utils/FullHeightComponent.vue';
import HeaderComponent from '@/src/components/home/HeaderComponent.vue';
import patientService from '@/src/services/PatientService/PatientService';
import { onMounted } from 'vue';

onMounted(async () => {
  const response = await patientService.getAllPatients({page:1,limit:10}, (errorMsg) => console.log(errorMsg))
  console.log(response)
})
</script>