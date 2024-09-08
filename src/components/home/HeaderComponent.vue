<template>
  <Toast />
  <Menubar :model="items" style="border-radius: 0%;">
    <template #start>
      <Image src="/hospital_icon.svg" width="25" class="cursor-pointer" @click="router.push('/about-us')" />
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
        <SplitButton :model="profileItems" outlined severity="secondary" v-if="loginService.isAuthenticated()" @click="editDialogVisible = true">
          <span class="flex items-center font-bold">
            <div v-if="loginService.getUserRole() !== 'patient'" class="flex items-center">
              <Avatar :image="`data:image/${loginService.getUserImgExt()};base64,${loginService.getUserImg()}`"
                shape="circle" v-if="loginService.getUserImg() !== null" class="mr-2" />
              <Avatar icon="pi pi-user" class="mr-2" shape="circle" v-else />
            </div>
            <span>{{loginService.getUserFirstName()}} {{loginService.getUserLastName()}}</span>
          </span>
        </SplitButton>
        <Button icon="pi pi-sign-in" outlined v-else @click="router.push('/signup')"></Button>
      </div>
    </template>
  </Menubar>
  <Dialog v-model:visible="editDialogVisible" header="Edit Personal Data" modal style="min-width: 280px;">
    <div
      :class="{
        ['flex flex-col gap-y-1']: loginService.getUserRole() === 'patient',
        ['flex flex-row gap-x-2']: loginService.getUserRole() !== 'patient',
      }"
    >
      <div v-if="loginService.getUserRole() !== 'patient'" class="flex flex-row ">
        <div class="flex flex-col gap-y-2">
          <label for="avatar" class="font-semibold">Profile Picture</label>
          <img 
            :src="previewImage || (loginService.getUserImg() ? `data:image/${loginService.getUserImgExt()};base64,${loginService.getUserImg()}` : '')" 
            v-if="previewImage || loginService.getUserImg() !== null" 
            class="rounded w-[250px] max-h-[167px]" 
          />
          <Avatar icon="pi pi-user" class="mr-2" size="xlarge" v-else />
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="loadImage"
            style="display: none;"
          />
          <Button 
            :label="selectedImageName === null ? 'Upload image (Max 2MB)' : selectedImageName" 
            :icon="`pi ${loading ? 'pi-spin pi-spinner' : 'pi-bookmark'}`" 
            outlined 
            @click="triggerFileInput" 
            :disabled="loading" 
            class="w-full"
          />
          <Button 
            label="Upload new avatar" 
            icon="pi pi-save" 
            outlined 
            @click="uploadImage" 
            :disabled="!selectedImageName" 
            class="w-full"
          />
          <div class="text-red-500 text-xs font-semibold" v-if="imageUploadError !== ''">{{ imageUploadError }}</div>
        </div>
      </div>
      <div class="flex flex-col">
        <InputTextWrapper 
          v-model="userFirstName" 
          id="text" 
          type="text" 
          placeholder="Joun"  
          label="First Name" 
          :is-required="true"
          :error-message="firstNameError"
        />
        <InputTextWrapper 
          v-model="userLastName" 
          id="email" 
          type="text" 
          placeholder="Pham"  
          label="Last Name"
          :is-required="true"
          :error-message="lastNameError"
        />
        <InputTextWrapper
          v-model="userAllergies" 
          id="text" 
          type="text" 
          placeholder="Peanuts" 
          label="Allergies"
          class="mt-1"
          v-if="loginService.getUserRole() === 'patient'"
        />
        <div v-if="loginService.getUserRole() === 'patient'">
          <div class="flex flex-row gap-x-1 mb-1 items-center">
            <label for="dob" class="font-semibold">Date of Birth</label>
          </div>
          <DatePicker id="dob" v-model="userDOB" class="w-full" dateFormat="dd/mm/yy" />
        </div>
        <div class="flex flex-row mb-1 items-center gap-x-1">
          <i class="pi pi-star-fill" style="color: red; font-size: 0.5rem" />
          <label for="gender" class="font-semibold">Gender</label>
        </div>
        <Select id="gender" v-model="userGender" :options="userGenders" optionLabel="name" placeholder="Select you gender" class="w-full" />
        <div class="text-red-500 text-xs font-semibold" v-if="genderError?.length !== 0">{{ genderError }}</div>
      </div>
      <div class="flex flex-col" v-if="loginService.getUserRole() !== 'patient'">
        <div class="flex flex-col gap-y-2">
          <label for="dept" class="font-semibold">Department</label>
          <Select v-model="userDepartment" id="dept" :options="departmentsData" optionLabel="department_name"
          placeholder="Select a Department" class="w-full min-w-[70px]" />
        </div>
        <div class="flex flex-col gap-y-2">
          <label for="job" class="font-semibold">Job Type</label>
          <Select v-model="userJobType" id="job" :options="jobTypes" optionLabel="name"
          placeholder="Select a Job Type" class="w-full min-w-[70px]" />
        </div>
        <div class="flex flex-col gap-y-1">
          <label for="salary" class="font-semibold">Salary</label>
          <InputNumber id="salary" v-model="userSalary" inputId="integeronly" fluid />
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" outlined severity="danger" @click="editDialogVisible = false" :disabled="loading" />
      <Button label="Save" :icon="`pi ${loading ? 'pi-spin pi-spinner' : 'pi-bookmark'}`" outlined @click="sendData" :disabled="loading" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
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
import { UpdateUserRequest } from "@/src/services/LoginService/interfaces";
import { Department } from "@/src/services/DepatmentsService/interfaces";
import departmentService from "@/src/services/DepatmentsService/DepartmentsService";
import InputNumber from "primevue/inputnumber";
import ticketService from "@/src/services/TicketService/TicketService";
import { NewTicketBody } from "@/src/services/TicketService/interfaces";
import fileService from "@/src/services/FileService/FileService";

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
]);

const fillUpItems = () => {
  if (loginService.getUserRole() === 'patient') {
    items.value.push(
      {
        label: 'My Appointments',
        icon: 'pi pi-book',
        route: '/my-appointments',
      },
    )
  } else if (loginService.getUserRole() === 'staff') {
    items.value.push(
      {
        label: 'My Appointments',
        icon: 'pi pi-book',
        route: '/staff-appointments',
      },
      {
        label: 'My Tickets',
        icon: 'pi pi-book',
        route: '/staff-tickets',
      },
    )
  } else if (loginService.getUserRole() === 'admin') {
    items.value = [
      {
        label: 'Users',
        icon: 'pi pi-address-book',
        route: '/admin-users',
      },
      {
        label: 'Appointments',
        icon: 'pi pi-book',
        route: '/admin-appointments',
      },
      {
        label: 'Tickets',
        icon: 'pi pi-id-card',
        route: '/admin-tickets',
      },
      {
        label: 'Departments',
        icon: 'pi pi-building',
        route: '/admin-departments',
      },
      {
        label: 'Schedules',
        icon: 'pi pi-calendar',
        route: '/admin-schedule',
      },
      {
        label: 'Reports',
        icon: 'pi pi-list',
        route: '/admin-reports',
      },
      {
        label: 'Treatments',
        icon: 'pi pi-hammer',
        route: '/admin-treatments',
      }
    ];
  }
}


const toast = useToast();

const editDialogVisible = ref(false);

const loading = ref(false);

const userDOB = ref(loginService.getUserDOB());
const userFirstName = ref(loginService.getUserFirstName() ?? '');
const userLastName = ref(loginService.getUserLastName() ?? '');
const userAllergies = ref(loginService.getUserAllergies() ?? '');
const userGender = ref(loginService.getUserGender());

const userSalary = ref(loginService.getUserSalary())
const userDepartment = ref(loginService.getUserDepartment());
const userJobType = ref(loginService.getUserJobType())

const firstNameError = ref('');
const lastNameError = ref('');
const genderError = ref('');

const previewImage = ref<string | null>(null);
const image = ref<File | null>();
const selectedImageName = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const imageUploadError = ref('');

const departmentsData = ref<Department[]>([]);

const jobTypes = ref([{code: 'D', name: 'Doctor'}, {code: 'N', name: 'Nurse'}]);

const fetchDepartmentData = async () => {
  departmentsData.value = await departmentService.getAllDepartments((errorMsg) => console.log(errorMsg));
}

watch(editDialogVisible, () => {

  if (loginService.getUserRole() !== 'patient') {
    userDOB.value = loginService.getUserDOB();
    userFirstName.value = loginService.getUserFirstName() ?? '';
    userLastName.value = loginService.getUserLastName() ?? '';
    userAllergies.value = loginService.getUserAllergies() ?? '';
    userGender.value = loginService.getUserGender();

    userSalary.value = loginService.getUserSalary();
    userDepartment.value = loginService.getUserDepartment();
    userJobType.value = loginService.getUserJobType();

    previewImage.value = null;
    image.value = null;
    selectedImageName.value = null;
  }
});

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

const ifFormErrors = computed(() => !(firstNameError.value === '' && lastNameError.value === '' && genderError.value === ''));

const validate = () => {
  if (userFirstName.value === '') {
    firstNameError.value = 'First Name is required';
  } else {
    firstNameError.value = '';
  }

  if (userLastName.value === '') {
    lastNameError.value = 'Last Name is required';
  } else {
    lastNameError.value = '';
  }

  if (userGender.value === null) {
    genderError.value = 'Gender is required';
  } else {
    genderError.value = '';
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const loadImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    if (file.type.startsWith('image/') && file.size <= 2097152) {
      image.value = file;
      selectedImageName.value = file.name;
      imageUploadError.value = '';

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      imageUploadError.value = '';
    } else {
      image.value = null;
      selectedImageName.value = null;
      imageUploadError.value = "Only image files less than 2MB are allowed.";
    }
  }
};

const uploadImage = async () => {
  await fileService.uploadFile(
    // @ts-ignore
    { mysql_id: loginService.getUserID(), file: image.value, dirTarget: 'staff', fileType: 'Avatar' },
    async () => {
      await loginService.getStaffInfo(); 
      toast.add({ severity: 'success', summary: 'Success', detail: 'Avatar updated successfully.', life: 5000 })
    },
    (errorMsg) => toast.add({ severity: 'error', summary: 'Failure', detail: errorMsg, life: 5000 })
  )
}

const sendData = async () => {
  validate();

  if (ifFormErrors.value) {
    return;
  }
  
  loading.value = true;

  if (loginService.getUserRole() === 'patient') {
    let request: UpdateUserRequest = {
      newAllergies: userAllergies.value,
      newFirstName: userFirstName.value,
      newLastName: userLastName.value,
      newGender: userGender.value.code ?? undefined,
      newDOB: loginService.getUserRole() === 'patient' ? userDOB.value?.toISOString().split('T')[0] ?? undefined : undefined,
    };

    await loginService.userUpdateData(
      request, 
      () => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.', life: 5000 });
        editDialogVisible.value = false;
        loading.value = false;
      }, 
      (errorMsg: string) => {
        toast.add({ severity: 'error', summary: 'Failure', detail: errorMsg, life: 5000 });
        loading.value = false;
      });
  } else {
    let request: NewTicketBody = {
      newFirstName: userFirstName.value,
      newLastName: userLastName.value,
      newGender: userGender.value.code ?? 'M',
      newSalary: userSalary.value ?? 0,
      newDepartmentID: userDepartment.value?.department_id ?? 0,
      newJobType: userJobType.value?.code ?? '',
    };

    await ticketService.createNewTicket(
      request,
      () => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Changes ticket was submitted.', life: 5000 });
        editDialogVisible.value = false;
        loading.value = false;
      }, 
      (errorMsg: string) => {
        toast.add({ severity: 'error', summary: 'Failure', detail: errorMsg, life: 5000 });
        loading.value = false;
      }
    );
  }
}

onMounted(async () => {
  await fetchDepartmentData();
  fillUpItems();
})

</script>