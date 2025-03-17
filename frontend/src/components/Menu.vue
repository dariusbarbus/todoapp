<template>
  <div>
    <button @click="goToHome">Home</button>
    <button @click="goToCalendar">Calendar</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter(); // Ensure this is inside <script setup>

const goToHome = () => {
  router.push('/');
};

const goToCalendar = () => {
  router.push('/calendar');
};
</script>

<style scoped>
button {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
}
</style>
