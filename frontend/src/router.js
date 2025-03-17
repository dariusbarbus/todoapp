import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Calendar from './views/Calendar.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/calendar', component: Calendar }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
