<template>
    <form @submit.prevent="updateAppointment" class="appointment-form">
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
      <button type="submit">Update Appointment</button>
    </form>
  </template>
  
  <script>
  import appointmentService from '@/api/appointmentService';
  
  export default {
    props: {
      appointment: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        appointmentData: {
          patientId: '',
          doctorId: '',
          date: '',
          time: ''
        },
        errorMessage: '',
        successMessage: ''
      };
    },
    watch: {
      appointment: {
        immediate: true,
        handler(newValue) {
          this.appointmentData = { ...newValue }; // Populate form with appointment data
        }
      }
    },
    methods: {
      async updateAppointment() {
        try {
          const appointmentPayload = {
            doctorId: this.appointmentData.doctorId,
            patientId: this.appointmentData.patientId,
            appointmentDateTime: `${this.appointmentData.date}T${this.appointmentData.time}:00`
          };
          console.log(this.appointment)
          console.log('Updating appointment with data:', appointmentPayload);
          console.log(this.appointment.id)
          await appointmentService.updateAppointment(this.appointment.id, appointmentPayload);
          this.successMessage = 'Appointment updated successfully!';
          this.$emit('update-success'); // Emit event to parent component
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  