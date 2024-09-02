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
        <SplitButton :model="profileItems" outlined severity="secondary" v-if="loginService.isAuthenticated()">
          <span class="flex items-center font-bold">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle"
              style="height: 80%; margin-right: 0.5rem" />
            <span>{{loginService.getUserFirstName()}} {{loginService.getUserLastName()}}</span>
          </span>
        </SplitButton>
        <Button icon="pi pi-sign-in" outlined v-else @click="router.push('/signup')"></Button>
      </div>
    </template>
  </Menubar>
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
import loginService from "@/src/services/LoginService/LoginService";
import { MenuItem } from "primevue/menuitem";
import router from "@/src/router";
import { useToast } from "primevue/usetoast";

const items = ref<MenuItem[]>([
  {
    label: 'About Us',
    icon: 'pi pi-users',
    route: '/about-us',
  },
  {
    label: 'Departments',
    icon: 'pi pi-star',
    route: '/departments'
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

const profileItems = ref([
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