<template>
  <div class="w-full h-full">
    <div class="flex flex-row gap-x-2 w-full justify-center mt-5">
      <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="width: 640px; height: 640px; border-radius: 0px;"
        :showItemNavigators="true" :showThumbnails="false" autoPlay>
        <template #item="slotProps">
          <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 640px; height: 640px; display: block;" />
        </template>
        <template #thumbnail="slotProps">
          <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" />
        </template>
      </Galleria>
      <div class="flex flex-col gap-y-2 justify-center-center">
        <p class="font-bold text-2xl">You look lonely...</p>
        <p class="font-bold text-xl">I can fix that.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Galleria from 'primevue/galleria';
import { ref } from 'vue';

const images = ref(
  ['dat6.jpg', 'dat1.jpg', 'dat2.jpg', 'dat3.jpg', 'dat4.png', 'dat5.jpg']
    .map((item, index) => Object({
      itemImageSrc: item,
      thumbnailImageSrc: item,
      alt: `Description for Image ${index}`,
      title: `Title ${index}`
    })
  )
);

const responsiveOptions = ref([
  {
    breakpoint: '991px',
    numVisible: 4
  },
  {
    breakpoint: '767px',
    numVisible: 3
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
]);
</script>