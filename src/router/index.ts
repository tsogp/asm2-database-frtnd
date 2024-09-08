import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/src/components/login/LoginComponent.vue'
import HomeComponent from '@/src/components/home/HomeComponent.vue'
import AboutUsComponent from '@/src/components/home/AboutUsComponent.vue'
import DoctorsComponent from '@/src/components/home/DoctorsComponent.vue'
import MyAppointmentsComponent from '@/src/components/home/MyAppointments/MyAppointmentsComponent.vue'
import StaffAppointment from '@/src/components/home/StaffAppointments.vue'
import StaffTickets from '@/src/components/home/StaffTickets.vue'
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
        path: 'staff-appointments',
        name: 'My Appointments',
        component: StaffAppointment,
        meta: { requiresAuth: true }
      },
      {
        path: 'staff-tickets',
        name: 'My Tickets',
        component: StaffTickets,
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