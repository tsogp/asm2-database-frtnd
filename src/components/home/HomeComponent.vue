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
</script>