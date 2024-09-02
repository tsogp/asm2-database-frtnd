<template>
  <Toast />
  <FullHeightComponent>
    <router-view></router-view>
  </FullHeightComponent>
</template>

<script setup lang="ts">
import FullHeightComponent from '@/src/components/utils/FullHeightComponent.vue';
import Toast from 'primevue/toast';
</script>