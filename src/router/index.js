import { createRouter, createWebHistory } from "vue-router";
import AppointmentScheduling from "@/components/AppointmentScheduling.vue";
import AppointmentUpdateForm from "@/components/AppointmentUpdateForm.vue";
 
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppointmentScheduling,
      meta: {
        requiresAuth: true,
      },
      children: [{ path: "/updateAppointment", component: AppointmentUpdateForm }],
    }
  ],
});
 
export default router;
 
 