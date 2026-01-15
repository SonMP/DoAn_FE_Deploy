import axios from '../axios';

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data);
}

const getAllDoctorsService = () => {
    return axios.get('/api/get-all-doctors');
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

const getScheduleDates = (doctorId) => {
    return axios.get(`/api/get-schedule-dates?doctorId=${doctorId}`);
}

const updateDoctorProfile = (data) => {
    return axios.put('/api/update-doctor-profile', data);
}

const getAllPatientForDoctor = (doctorId, date) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${date}`);
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data);
}

const saveBulkScheduleWeek = (data) => {
    return axios.post('/api/bulk-create-schedule-week', data);
}

export default {
    saveDetailDoctorService,
    getAllDoctorsService,
    getScheduleDoctorByDate,
    saveBulkScheduleDoctor,
    getScheduleDates,
    updateDoctorProfile,
    getAllPatientForDoctor,
    postSendRemedy,
    saveBulkScheduleWeek
}