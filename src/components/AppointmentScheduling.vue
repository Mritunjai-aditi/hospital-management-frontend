<template>
  <div class="appointment-scheduling">
    <h1>Schedule an Appointment</h1>

    <!-- Display error or success messages -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <!-- Appointment form -->
    <form @submit.prevent="scheduleAppointment" class="appointment-form">
      <div>
        <label for="doctorId">Doctor ID</label>
        <input v-model="appointmentData.doctorId" type="number" id="doctorId" required />
      </div>
      <div>
        <label for="patientId">Patient ID</label>
        <input v-model="appointmentData.patientId" type="number" id="patientId" required />
      </div>
      <div>
        <label for="date">Date</label>
        <input v-model="appointmentData.date" type="date" id="date" required />
      </div>
      <div>
        <label for="time">Time</label>
        <input v-model="appointmentData.time" type="time" id="time" required />
      </div>
      <button type="submit">Book Appointment</button>
    </form>

    <h2>Your Appointments</h2>
    <ul v-if="appointments.length > 0">
      <li v-for="appointment in appointments" :key="appointment.id">
        Patient {{ appointment.patientId }} has an appointment with Doctor {{ appointment.doctorId }} on {{ appointment.appointmentDateTime }}
        <button @click="cancelAppointment(appointment.id)">Cancel</button>
        <button @click="openUpdateDialog(appointment)">Update</button>
      </li>
    </ul>

    <!-- Update Appointment Dialog -->
    <dialog class="dialog" ref="updateAppointment" v-if="showUpdateDialog">
      <button class="close-button" @click="closeUpdateDialog">Close</button>
      <AppointmentUpdateForm 
        :appointment="selectedAppointment" 
        @update-success="loadAppointments" 
      />
    </dialog>
  </div>
</template>

<script>
import appointmentService from '@/api/appointmentService';
import AppointmentUpdateForm from './AppointmentUpdateForm.vue';

export default {
  data() {
    return {
      appointmentData: {
        patientId: '',
        doctorId: '',
        date: '',
        time: ''
      },
      appointments: [],  // Appointments list
      errorMessage: '',
      successMessage: '',
      showUpdateDialog: false,
      selectedAppointment: null
    };
  },
  components: {
    AppointmentUpdateForm,
  },
  created() {
    this.loadAppointments();  // Load actual appointments from the backend
  },
  methods: {
    openUpdateDialog(appointment) {
      this.selectedAppointment = { ...appointment }; // Clone the selected appointment data
      this.showUpdateDialog = true; // Open the dialog
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false; // Close the dialog
      this.selectedAppointment = null; // Reset selected appointment
    },
    async loadAppointments() {
      try {
        const response = await appointmentService.getAllAppointments();
        this.appointments = response.data;
        this.closeUpdateDialog()
      } catch (error) {
        this.handleError(error);
      }
    },
    async scheduleAppointment() {
      const appointmentPayload = {
        doctorId: this.appointmentData.doctorId,
        patientId: this.appointmentData.patientId,
        appointmentDateTime: `${this.appointmentData.date}T${this.appointmentData.time}:00`
      };

      try {
        const response = await appointmentService.createAppointment(appointmentPayload);
        this.appointments.push(response.data);
        this.successMessage = 'Appointment booked successfully!';
        this.resetForm();
      } catch (error) {
        this.handleError(error);
      }
    },
    async cancelAppointment(id) {
      try {
        await appointmentService.deleteAppointment(id);
        this.appointments = this.appointments.filter(appointment => appointment.id !== id);
        this.successMessage = 'Appointment canceled successfully!';
      } catch (error) {
        this.handleError(error);
      }
    },
    resetForm() {
      this.appointmentData = {
        patientId: '',
        doctorId: '',
        date: '',
        time: ''
      };
    },
    handleError(error) {
      this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      this.successMessage = '';
    }
  }
};
</script>


<style scoped>
.dialog {
  width: 80%;
  max-width: 40rem;
  border: #f8cdcd;
  border-radius: 10px;
  display: block; /* Ensure the dialog is displayed properly */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
 
.appointment-form {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 30px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input[type="text"],
input[type="date"],
input[type="time"],
select {
  padding: 10px;
  font-size: 18px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

button:hover {
  background-color: #2980b9;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
