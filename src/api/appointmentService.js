// appointmentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/appointments';

export default {
  getAllAppointments() {
    return axios.get(`${API_BASE_URL}`);
  },
  createAppointment(appointmentPayload) {
    return axios.post(`${API_BASE_URL}/create`, appointmentPayload);
  },
  deleteAppointment(id) {
    return axios.delete(`${API_BASE_URL}/delete/${id}`);
  },
  updateAppointment(id,appointmentPayload) {
    return axios.put(`${API_BASE_URL}/update/${id}`, appointmentPayload);
  },
};
