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
import treatmentMenuService from '@/src/services/TreatmentMenuService/TreatmentMenuService';

onMounted(async () => {
  let response;
  // response = await patientService.getAllPatients({page:1,limit:10}, (errorMsg) => console.log(errorMsg))
  // response = await treatmentMenuService.getAllMenus((err) => console.log(err));
  // response = await treatmentMenuService.getTreatmentMenuById({id: 1}, (err) => console.log(err));
  // response = await treatmentMenuService.addTreatmentMenu({ treatment_name: 'Mental Treatment 2', treatment_cost: 10000}, 
  //   () => console.log('treatment menu added!'), 
  //   (err) => console.log(err));
  
  console.log(response);
})
</script>