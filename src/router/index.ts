import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/src/components/login/LoginComponent.vue'
import HomeComponent from '@/src/components/home/HomeComponent.vue'
import AboutUsComponent from '@/src/components/home/AboutUsComponent.vue'
import DoctorsComponent from '@/src/components/home/DoctorsComponent.vue'
import MyAppointmentsComponent from '@/src/components/home/MyAppointments/MyAppointmentsComponent.vue'
import StaffAppointment from '@/src/components/home/StaffAppointments/StaffAppointments.vue'
import StaffTickets from '@/src/components/home/StaffTickets/StaffTickets.vue'
import loginService from '../services/LoginService/LoginService'
import AdminUserControlComponent from '../components/home/AdminUserControlComponent/AdminUserControlComponent.vue'
import AdminTreatmentControlComponent from '../components/home/AdminTreatmentControlComponent/AdminTreatmentControlComponent.vue'
import AdminTicketControlComponent from '../components/home/AdminTicketControlComponent/AdminTicketControlComponent.vue'
import AdminScheduleControlComponent from '../components/home/AdminScheduleControlComponent/AdminScheduleControlComponent.vue'
import AdminDepartmentControlComponent from '../components/home/AdminDepartmentControlComponent/AdminDepartmentControlComponent.vue'
import AdminAppointmentControlComponent from '../components/home/AdminAppointmentControlComponent/AdminAppointmentControlComponent.vue'
import AdminReportControlComponent from '../components/home/AdminReportControlComponent.vue/AdminReportControlComponent.vue'

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
        name: 'Staff Appointments',
        component: StaffAppointment,
        meta: { requiresAuth: true }
      },
      {
        path: 'staff-tickets',
        name: 'My Tickets',
        component: StaffTickets,
        meta: { requiresAuth: true }
      },
      {
        path: 'admin-users',
        name: 'User Control',
        component: AdminUserControlComponent,
        meta: { requiresAuth: true }
      },
      {
        path: 'admin-treatments',
        name: 'Treatment Control',
        component: AdminTreatmentControlComponent,
        meta: { requiresAuth: true }
      },
      {
        path: 'admin-tickets',
        name: 'Ticket Control',
        component: AdminTicketControlComponent,
        meta: { requiresAuth: true }
      },
      {
        path: 'admin-departments',
        name: 'Department Control',
        component: AdminDepartmentControlComponent,
        meta: { requiresAuth: true }
      },
      {
        path: 'admin-appointments',
        name: 'Appointment Control',
        component: AdminAppointmentControlComponent,
        meta: { requiresAuth: true }
      }
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