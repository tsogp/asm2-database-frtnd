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
import treatmentRecordService from '@/src/services/TreatmentRecordService/TreatmentRecordService';
import dayjs from 'dayjs';
import scheduleService from '@/src/services/ScheduleService/ScheduleService';

onMounted(async () => {
  let response;
  // response = await patientService.getAllPatients({page:1,limit:10}, (errorMsg) => console.log(errorMsg))
  // response = await treatmentMenuService.getAllMenus((err) => console.log(err));
  // response = await treatmentMenuService.getTreatmentMenuById({id: 1}, (err) => console.log(err));
  // response = await treatmentMenuService.addTreatmentMenu({ treatment_name: 'Mental Treatment 2', treatment_cost: 10000}, 
  //   () => console.log('treatment menu added!'), 
  //   (err) => console.log(err));
  
  // response = await treatmentRecordService.getMyTreatmentRecords({page: 1, limit: 10}, (err) => console.log(err));
  // response = await treatmentRecordService.getTreatmentRecordByAppointment({id : 3}, {page: 1, limit: 10}, (err) => console.log(err));
  // response = await treatmentRecordService.getTreatmentRecordByPatient({id : 41}, {page: 1, limit: 10}, (err) => console.log(err));
  // response = await treatmentRecordService.getTreatmentRecordById({id : 2}, (err) => console.log(err));
  // response = await treatmentRecordService.addTreatmentRecord({ treatment_id : 3, treatment_date : "2024-09-04xx", appointment_id : 3}, 
  //   () => console.log('treatment record added!'), 
  //   (err) => console.log(err));
  // response = await treatmentRecordService.markTreatmentRecordAsFinished({id : 3}, () => console.log('treatment record marked as finished!'), (err) => console.log(err));
  
  // response = await scheduleService.getAllSchedule({page: 1, limit: 10}, (err) => console.log(err));
  // response = await scheduleService.getScheduleByStaff({id: 2}, (err) => console.log(err));
  // response = await scheduleService.getFreeSchedule({page: 1, limit: 10}, (err) => console.log(err));
  console.log(response);
});
  
</script>