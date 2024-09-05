<template>
  <Toast />
  <Menubar :model="items" style="border-radius: 0%;">
    <template #start>
      <Image src="/hospital_icon.svg" width="25" />
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut
          }}</span>
        <i v-if="hasSubmenu"
          :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <Button icon="pi pi-calendar-clock" outlined label="Book an appointment" />
        <SplitButton :model="profileItems" outlined severity="secondary" v-if="loginService.isAuthenticated()" @click="editDialogVisible = true">
          <span class="flex items-center font-bold">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle"
              style="height: 80%; margin-right: 0.5rem" v-if="loginService.getUserRole() !== 'patient'"/>
            <span>{{loginService.getUserFirstName()}} {{loginService.getUserLastName()}}</span>
          </span>
        </SplitButton>
        <Button icon="pi pi-sign-in" outlined v-else @click="router.push('/signup')"></Button>
      </div>
    </template>
  </Menubar>
  <Dialog v-model:visible="editDialogVisible" header="Edit Personal Data" modal style="min-width: 300px;">
    <InputTextWrapper 
      v-model="userEmail" 
      id="email" 
      type="text" 
      placeholder="email@email.com" 
      :isRequired="true" 
      label="Email" 
    />
    <InputTextWrapper 
      v-model="userFirstName" 
      id="text" 
      type="text" 
      placeholder="Joun" 
      :isRequired="true" 
      label="First Name" 
    />
    <InputTextWrapper 
      v-model="userLastName" 
      id="email" 
      type="text" 
      placeholder="Pham" 
      :isRequired="true" 
      label="Last Name" 
    />
    <InputTextWrapper
      v-model="userAllergies" 
      id="text" 
      type="text" 
      placeholder="Peanuts" 
      label="Allergies" 
    />
    <div class="flex flex-row gap-x-1 my-2 items-center">
			<i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
			<label for="dob" class="font-semibold">Date of Birth</label>
		</div>
    <DatePicker id="dob" v-model="userDOB" class="w-full" dateFormat="dd/mm/yy" />
    <div class="flex flex-row my-2 items-center">
			<label for="gender" class="font-semibold">Gender</label>
		</div>
    <Select id="gender" v-model="userGender" :options="userGenders" optionLabel="name" placeholder="Select you gender" class="w-full" />
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" outlined severity="danger" @click="editDialogVisible = false" />
      <Button label="Save" icon="pi pi-bookmark" outlined @click="editDialogVisible = false" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menubar from "primevue/menubar";
import SplitButton from "primevue/splitbutton";
import Badge from "primevue/badge";
import Image from "primevue/image";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import loginService from "@/src/services/LoginService/LoginService";
import { MenuItem } from "primevue/menuitem";
import router from "@/src/router";
import { useToast } from "primevue/usetoast";
import InputTextWrapper from "../utils/InputTextWrapper.vue";

const items = ref<MenuItem[]>([
  {
    label: 'About Us',
    icon: 'pi pi-users',
    route: '/about-us',
  },
  {
    label: 'Doctors',
    icon: 'pi pi-search',
    route: '/doctors',
  },
  {
    label: 'My Appointments',
    icon: 'pi pi-book',
    route: '/my-appointments',
    roles: ['patient', 'staff'],
  },
  {
    label: 'My Treatments',
    icon: 'pi pi-calendar',
    route: '/my-treatments',
    roles: ['patient', 'staff'],
  }
]);

const toast = useToast();

const editDialogVisible = ref(false);

const userEmail = ref(loginService.getUserEmail() ?? '');
const userDOB = ref(loginService.getUserDOB() ?? '');
const userFirstName = ref(loginService.getUserFirstName() ?? '');
const userLastName = ref(loginService.getUserLastName() ?? '');
const userAllergies = ref(loginService.getUserAllergies() ?? '');
const userGender = ref(loginService.getUserGender());

const userGenders = ref([
  {
    code: 'M',
    name: 'Male',
  },
  {
    code: 'F',
    name: 'Female',
  },
  {
    code: 'O',
    name: 'Other',
  },
])

const profileItems = ref([
  {
    label: 'My Profile',
    icon: 'pi pi-user',
    command: () => editDialogVisible.value = true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => loginService.logout(
      () => toast.add({ severity: 'success', summary: 'Log out was successful.', detail: 'Log in or register to enter your account.', life: 5000 }),
      () => toast.add({ severity: 'error', summary: 'Log out was not successful.', detail: 'Try again.', life: 5000 })
    )
  }
]);
</script>