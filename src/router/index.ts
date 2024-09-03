import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/src/components/login/LoginComponent.vue'
import HomeComponent from '@/src/components/home/HomeComponent.vue'
import AboutUsComponent from '@/src/components/home/AboutUsComponent.vue'
import DepartmentsComponent from '@/src/components/home/DepartmentsComponent.vue'
import DoctorsComponent from '@/src/components/home/DoctorsComponent.vue'
import MyAppointmentsComponent from '@/src/components/home/MyAppointments/MyAppointmentsComponent.vue'
import MyTreatmentsComponent from '@/src/components/home/MyTreatmentsComponent.vue'
import requestService from '@/src/services/RequestService'
import Cookies from 'js-cookie'
import loginService from '../services/LoginService/LoginService'

const routes = [
  {
    path: '/signup',	
    name: 'Sign Up',
    component: LoginComponent
  },
	{
    path: '/',
    name: 'Hospital Management System',
    component: HomeComponent,
    children: [
      {
        path: 'about-us',
        name: 'About Us',
        component: AboutUsComponent,
      },
      {
        path: 'departments',
        name: 'Departments',
        component: DepartmentsComponent,
      },
      {
        path: 'doctors',
        name: 'Doctors',
        component: DoctorsComponent,
      },
      {
        path: 'my-appointments',
        name: 'My Appointments',
        component: MyAppointmentsComponent,
        meta: { requiresAuth: true }
      },
      {
        path: 'my-treatments',
        name: 'My Treatments',
        component: MyTreatmentsComponent,
        meta: { requiresAuth: true }
      },
    ]
	},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !loginService.isAuthenticated()) {
    next('/signup');
  } else {
    next();
  }
});

export default router