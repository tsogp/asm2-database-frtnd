<template>
	<FullHeightComponent>
		<div class="flex items-center justify-center h-full">
			<Card style="width: 25rem; overflow: hidden">
				<template #header>
					<div class="flex flex-row justify-between mx-5 mt-5">
						<SelectButton v-model="signUpType" :options="signUpTypes" :allowEmpty="false" />
						<SelectButton 
							v-model="signUpRole" 
							:options="signUpRoles" 
							:disabled="signUpType === SignUpTypes.REGISTER" 
							:optionDisabled="SignUpRoles.PATIENT"
							:allowEmpty="false"
						/>
					</div>
				</template>
				<template #title>{{signUpRole}} {{signUpType}}</template>
				<template #content>
					<div v-if="signUpType === SignUpTypes.LOGIN" class="flex flex-col gap-y-2">
						<InputTextWrapper 
							v-model="email" 
							id="email" 
							type="text" 
							placeholder="email@email.com" 
							label="Email"
							:errorMessage="emailError"
						/>
						<InputTextWrapper 
							v-model="password" 
							id="password" 
							type="password" 	
							label="Password" 
							:errorMessage="passwordError"
						/>
					</div>
					<div v-else class="flex flex-col gap-y-2">
						<InputTextWrapper 
							v-model="email" 
							id="email" 
							type="text" 
							placeholder="email@email.com" 
							:isRequired="true" 
							label="Email" 
							:errorMessage="emailError"
						/>
						<InputTextWrapper 
							v-model="password" 
							id="password" 
							type="password" 
							:isRequired="true" 
							label="Password" 
							:errorMessage="passwordError"
						/>
						<InputTextWrapper 
							v-model="repeatPassword" 
							id="repeatPassword" 
							type="password" 
							:isRequired="true" 
							label="Repeat Password" 
							:errorMessage="passwordError"
						/>
						<InputTextWrapper 
							v-model="firstName" 
							id="firstName" 
							type="text" 
							:isRequired="true" 
							label="First Name"
							placeholder="Joun" 
							:errorMessage="firstNameError"
						/>
						<InputTextWrapper 
							v-model="lastName" 
							id="lastName" 
							type="text" 
							:isRequired="true" 
							label="Last Name"
							placeholder="The Desirerer"
							:errorMessage="lastNameError" 
						/>
					</div>
				</template>
				<template #footer>
					<div class="flex justify-end">
						<Button 
							:icon="signUpType === SignUpTypes.LOGIN ? 'pi pi-sign-in' : 'pi pi-user-plus'" 
							:label="signUpType" 
							outlined 
							class="mt-2"
							@click="handleSignup" 
						/>
					</div>
				</template>
			</Card>
		</div>
	</FullHeightComponent>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import FullHeightComponent from '@/src/components/utils/FullHeightComponent.vue';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputTextWrapper from '@/src/components/utils/InputTextWrapper.vue';
import loginService from '@/src/services/LoginService/LoginService';
import registerService from '@/src/services/RegisterService/RegisterService';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import { SignUpTypes, SignUpRoles } from './mappings';
import router from '@/src/router';

const signUpType = ref(SignUpTypes.REGISTER);
const signUpRole = ref(SignUpRoles.PATIENT);

const signUpTypes = computed(() => Object.values(SignUpTypes));
const signUpRoles = computed(() => Object.values(SignUpRoles));

const email = ref('');
const password = ref('');
const repeatPassword = ref('');
const firstName = ref('');
const lastName = ref('');

const emailError = ref('');
const passwordError = ref('');
const firstNameError = ref('');
const lastNameError = ref('');

const toast = useToast();

watch(() => signUpType.value, (value) => {
	if (value === SignUpTypes.REGISTER) {
		signUpRole.value = SignUpRoles.PATIENT;
	}
});

const ifFormErrors = computed(() => !(emailError.value === '' && passwordError.value === ''));

const validate = () => {
	if (signUpType.value === SignUpTypes.REGISTER) {
		if (email.value === '') {
			emailError.value = 'Email is required';
		} else {
			emailError.value = '';
		}

		if (password.value === '') {
			passwordError.value = 'Password is required';
		} else if (password.value !== repeatPassword.value) {
			passwordError.value = 'Passwords do not match';
		} else {
			passwordError.value = '';
		}

		if (firstName.value === '') {
			firstNameError.value = 'First Name is required';
		} else {
			firstNameError.value = '';
		}

		if (lastName.value === '') {
			lastNameError.value = 'Last Name is required';
		} else {
			lastNameError.value = '';
		}
	}
};

const onLoginSuccess = () => {
	toast.add({ severity: 'success', summary: 'Login successful.', detail: 'Redirecting...', life: 1000 });

	if (loginService.getUserRole() === 'patient') {
  	router.push("/about-us");
	} else if (loginService.getUserRole() === 'staff') {
		router.push("/staff-appointments");
	} else {
		router.push("/admin-users");
	}
} 

const onLoginFailure = (errorMsg: string) => {
  toast.add({ severity: 'error', summary: 'Login failed.', detail: errorMsg, life: 5000 });
}

const onRegisterSuccess = () => {
  password.value = '';
  signUpType.value = SignUpTypes.LOGIN;
  toast.add({ severity: 'success', summary: 'Sign up was successful.', detail: 'Log in to enter your account.', life: 5000 });
}

const onRegisterFailure = (errorMsg: string) => {
  toast.add({ severity: 'error', summary: 'Sign up failed.', detail: errorMsg, life: 5000 });
}

const handleSignup = async () => {
	validate();

  if (ifFormErrors.value) {
		return;
  }

  const response = (signUpType.value === SignUpTypes.LOGIN) 
    ? (signUpRole.value === SignUpRoles.PATIENT)
      ? await loginService.patientLogin(email.value, password.value, onLoginSuccess, onLoginFailure)
      : await loginService.staffLogin(email.value, password.value, onLoginSuccess, onLoginFailure)
    : await registerService.registerPatient(email.value, password.value, firstName.value, lastName.value, onRegisterSuccess, onRegisterFailure);
};

</script>