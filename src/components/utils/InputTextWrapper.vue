<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-x-1 items-center">
			<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" v-if="isRequired"></i>
			<label :for="id" class="font-semibold">{{ label }}</label>
		</div>
    <InputMask
      :id="id" 
      :type="type" 
      :placeholder="placeholder" 
      v-model="internalValue" 
			:mask="mask"
			v-if="mask !== undefined"
    />
		<InputText 
      :id="id" 
      :type="type" 
      :placeholder="placeholder" 
      v-model="internalValue" 
			v-else
    />
    <div class="text-red-500 text-xs font-semibold" v-if="errorMessage?.length !== 0">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';

const props = defineProps({
  id: String,
  type: String,
  placeholder: String,
  modelValue: [String, Number],
  isRequired: Boolean,
  label: String,
	mask: String,
	errorMessage: String,
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});
</script>