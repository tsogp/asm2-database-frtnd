<template>
	<Menubar :model="items" style="border-radius: 0%;">
		<template #start>
			<Image src="/hospital_icon.svg" width="25" class="cursor-pointer" />
		</template>
		<template #item="{ item, props, hasSubmenu, root }">
			<a v-ripple class="flex items-center" v-bind="props.action">
				<span :class="item.icon" />
				<span class="ml-2">{{ item.label }}</span>
				<Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
				<span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
				<i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
			</a>
		</template>
		<template #end>
			<div class="flex items-center gap-2">
				<Button icon="pi pi-calendar-clock" outlined label="Book an appointment"/>
				<Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
			</div>
		</template>
	</Menubar>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import Image from "primevue/image";
import Avatar from "primevue/avatar";
import Button from "primevue/button";

const items = ref([
	{
		label: 'About Us',
		icon: 'pi pi-users'
	},
	{
		label: 'Departments',
		icon: 'pi pi-star'
	},
	{
		label: 'Doctors',
		icon: 'pi pi-search',
	},
]);
</script>