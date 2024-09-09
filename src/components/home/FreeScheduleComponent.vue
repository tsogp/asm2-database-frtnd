<template>
  <div>
    <div class="flex flex-row items-center gap-x-1">
      <i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" v-if="isRequired"/>
      <label for="dept" class="font-semibold">{{ title }}</label>
    </div>
    <div v-for="schedule in schedules" :key="schedule.staff_id">
      <h3 class="text-md font-semibold">{{ dayjs(schedule.schedule_date).format('YYYY-MM-DD') }}</h3>
      <div class="flex flex-row flex-wrap gap-2 my-2">
        <Tag
          :severity="isSelected(schedule.schedule_date, 1) ? 'success' : showBusy && schedule['09:00-10:00'] === 'busy' ? 'danger' : showBusy && schedule['09:00-10:00'] === 'busy' ? 'danger' : 'info'"
          value="09:00-10:00"
          v-if="showBusy || schedule['09:00-10:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 1)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 2) ? 'success' : showBusy && schedule['10:00-11:00'] === 'busy' ? 'danger' : 'info'"
          value="10:00-11:00"
          v-if="showBusy || schedule['10:00-11:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 2)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 3) ? 'success' : showBusy && schedule['11:00-12:00'] === 'busy' ? 'danger' : 'info'"
          value="11:00-12:00"
          v-if="showBusy || schedule['11:00-12:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 3)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 4) ? 'success' : showBusy && schedule['12:00-13:00'] === 'busy' ? 'danger' : 'info'"
          value="12:00-13:00"
          v-if="showBusy || schedule['12:00-13:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 4)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 5) ? 'success' : showBusy && schedule['13:00-14:00'] === 'busy' ? 'danger' : 'info'"
          value="13:00-14:00"
          v-if="showBusy || schedule['13:00-14:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 5)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 6) ? 'success' : showBusy && schedule['14:00-15:00'] === 'busy' ? 'danger' : 'info'"
          value="14:00-15:00"
          v-if="showBusy || schedule['14:00-15:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 6)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 7) ? 'success' : showBusy && schedule['15:00-16:00'] === 'busy' ? 'danger' : 'info'"
          value="15:00-16:00"
          v-if="showBusy || schedule['15:00-16:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 7)"
        />
        <Tag
          :severity="isSelected(schedule.schedule_date, 8) ? 'success' : showBusy && schedule['16:00-17:00'] === 'busy' ? 'danger' : 'info'"
          value="16:00-17:00"
          v-if="showBusy || schedule['16:00-17:00'] === 'available'"
          class="cursor-pointer"
          @click="selectSlot(schedule.schedule_date, 8)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FreeSchedule } from '@/src/services/ScheduleService/interfaces';
import dayjs, { Dayjs } from 'dayjs';
import { defineEmits, defineProps, ref } from 'vue';
import Tag from 'primevue/tag';

const props = defineProps<{
  schedules: FreeSchedule[];
  title: string;
  isRequired: boolean;
  showBusy?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', selected: { schedule_date: Dayjs; slot: number }): void;
}>();

const selectedSchedule = ref<{ schedule_date: Dayjs; slot: number } | null>(null);

const isSelected = (schedule_date: Dayjs, slot: number): boolean => {
  return selectedSchedule.value?.schedule_date.isSame(schedule_date, 'day') && selectedSchedule.value?.slot === slot;
};

const selectSlot = (schedule_date: Dayjs, slot: number) => {
  if (props.showBusy) {
    return;
  }

  selectedSchedule.value = { schedule_date, slot };
  emit('update:modelValue', { schedule_date, slot });
};
</script>
