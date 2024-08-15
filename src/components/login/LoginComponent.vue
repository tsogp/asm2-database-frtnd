<template>
	<FullHeightComponent>
		<div class="flex items-center justify-center h-full">
			<Card style="width: 25rem; overflow: hidden">
				<template #header>
					<div class="flex flex-row justify-between mx-5 mt-5">
						<SelectButton v-model="signUpType" :options="signUpTypes" />
						<SelectButton 
							v-model="signUpRole" 
							:options="signUpRoles" 
							:disabled="signUpType === SignUpTypes.REGISTER" 
							:optionDisabled="SignUpRoles.PATIENT"
						/>
					</div>
				</template>
				<template #title>{{signUpRole}} {{signUpType}}</template>
				<template #content>
					<div v-if="signUpType === SignUpTypes.LOGIN">
						<InputTextWrapper 
							v-model="email" 
							id="email" 
							type="text" 
							placeholder="email@email.com" 
							:isRequired="true" 
							label="Email" 
						/>
						<InputTextWrapper 
							v-model="password" 
							id="password" 
							type="password" 
							:isRequired="true" 
							label="Password" 
						/>
					</div>
					<div v-else>
						<InputTextWrapper 
							v-model="email" 
							id="email" 
							type="text" 
							placeholder="email@email.com" 
							:isRequired="true" 
							label="Email" 
						/>
						<InputTextWrapper 
							v-model="phone" 
							id="phone" 
							type="text" 
							placeholder="(999)-999-9999" 
							:isRequired="false" 
							label="Phone Number"
							mask="(999)-999-9999"
						/>
						<InputTextWrapper 
							v-model="password" 
							id="password" 
							type="password" 
							:isRequired="true" 
							label="Password" 
						/>
						<InputTextWrapper 
							v-model="repeatPassword" 
							id="repeatPassword" 
							type="password" 
							:isRequired="true" 
							label="Repeat Password" 
						/>
						<InputTextWrapper 
							v-model="firstName" 
							id="firstName" 
							type="text" 
							:isRequired="true" 
							label="First Name"
							placeholder="Joun" 
						/>
						<InputTextWrapper 
							v-model="lastName" 
							id="lastName" 
							type="text" 
							:isRequired="true" 
							label="Last Name"
							placeholder="The Desirerer" 
						/>
					</div>
				</template>
				<template #footer>
					<div class="flex">
						<Button :label="signUpType" outlined class="justify-end mt-2" />
					</div>
				</template>
			</Card>
		</div>
	</FullHeightComponent>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import FullHeightComponent from '@/src/components/utils/FullHeightComponent.vue';
import Button from 'primevue/button';
import InputTextWrapper from '../utils/InputTextWrapper.vue';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import FormField from '@/src/components/utils/interfaces';
import { SignUpTypes, SignUpRoles } from './mappings';

const signUpType = ref(SignUpTypes.REGISTER);
const signUpRole = ref(SignUpRoles.PATIENT);

const signUpTypes = computed(() => Object.values(SignUpTypes));
const signUpRoles = computed(() => Object.values(SignUpRoles));

const email = ref<FormField<String>>({data: '', error: '', isValid: false, validator: () => email.value.data.length > 0});
const password = ref<FormField<String>>({data: '', error: '', isValid: false, validator: () => password.value.data.length > 0});
const repeatPassword = ref<FormField<String>>({data: '', error: '', isValid: false, validator: () => repeatPassword.value.data === password.value.data});
const firstName = ref<FormField<String>>({data: '', error: '', isValid: false, validator: () => firstName.value.data.length > 0});
const lastName = ref<FormField<String>>({data: '', error: '', isValid: false, validator: () => lastName.value.data.length > 0});
const phone = ref<FormField<String>>({data: '', error: '', isValid: false, validator: () => phone.value.data.length == 10});

watch(() => signUpType.value, (value) => {
	if (value === SignUpTypes.REGISTER) {
		signUpRole.value = SignUpRoles.PATIENT;
	}
});
</script>