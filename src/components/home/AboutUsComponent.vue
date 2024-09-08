<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="flex flex-col max-w-[1200px] justify-center">
      <Divider align="left" type="solid">
        <b>About us</b>
      </Divider>

      <p class="m-0">
        Welcome to our hospital, where your health and well-being are our top priorities. Our dedicated team of healthcare professionals is committed to providing you with the highest quality medical care in a compassionate and supportive environment. 
        We strive to ensure that every patient receives personalized attention and treatment tailored to their unique needs.
      </p>

      <Divider align="left" type="solid">
        <b>Our Mission</b>
      </Divider>

      <p class="m-0">
        At our hospital, our mission is to deliver exceptional healthcare services that improve the lives of our patients and their families. We are dedicated to advancing medical knowledge and practices through continuous education and research, 
        ensuring that we remain at the forefront of medical innovation.
      </p>

      <Divider align="left" type="solid">
        <b>Our Values</b>
      </Divider>

      <p class="m-0">
        We believe in treating every patient with dignity, respect, and empathy. Our core values of integrity, excellence, and teamwork guide us in everything we do. We are committed to creating a safe and welcoming environment for all, 
        where patients can feel confident in the care they receive.
      </p>

      <Divider align="left" type="solid">
        <b>Our Services</b>
      </Divider>

      <p class="m-0">
        Our hospital offers a comprehensive range of medical services, from primary care and preventive medicine to specialized treatments and surgical procedures. Our state-of-the-art facilities are equipped with the latest technology, 
        allowing us to provide accurate diagnoses and effective treatments. Whether you are here for a routine check-up or a complex medical procedure, you can trust that you are in capable hands.
      </p>

      <Divider align="left" type="solid">
        <b>Contact Us</b>
      </Divider>

      <p class="m-0">
        We are here to support you every step of the way. If you have any questions or need assistance, please do not hesitate to contact us. Our friendly and knowledgeable staff are always available to help you with any concerns you may have. 
        Thank you for choosing our hospital as your healthcare provider. We look forward to serving you and your family.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider';
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