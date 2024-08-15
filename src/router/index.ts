import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/src/components/login/LoginComponent.vue'
import HomeComponent from '@/src/components/home/HomeComponent.vue'

const routes = [
	{
    path: '/',
    name: 'Hospital Management System',
    component: HomeComponent
	},
  {
    path: '/signup',	
    name: 'Sign Up',
    component: LoginComponent
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router