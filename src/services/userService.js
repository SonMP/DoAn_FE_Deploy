import axios from '../axios';

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password });
}

const registerUserService = (data) => {
    return axios.post('/api/patient-sign-up', data)
}

const getAllUsers = (inputId) => {
    return axios.get('/api/get-all-users', {
        params: { id: inputId }
    });
}

const createUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: { id: userId }
    })
}

const editUserService = (data) => {
    return axios.put('/api/edit-user', data)
}

const getQuyDinhService = (type) => {
    return axios.get('/api/get-quydinh', {
        params: { loai: type }
    });
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const getDoctorsHome = (limitInput) => {
    return axios.get('/api/get-doctors', {
        params: { limit: limitInput }
    })
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id`, {
        params: { id: inputId }
    })
}

const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data);
}

const getPatientHistory = (patientId) => {
    return axios.get(`/api/get-history-by-patient-id?patientId=${patientId}`);
}

const getBookingByEmail = (email) => {
    return axios.get(`/api/get-patient-booking-by-email?email=${email}&timestamp=${new Date().getTime()}`);
}

const postVerifyCancelBooking = (data) => {
    return axios.post('/api/patient-request-cancel-booking', data);
}

const verifyCancelBooking = (data) => {
    return axios.post('/api/verify-cancel-booking', data);
}

const getPatientChatSummary = (patientId) => {
    return axios.get(`/api/get-patient-chat-summary?patientId=${patientId}`);
}

const postChatbot = (data) => {
    return axios.post('/api/chat-bot', data)
}

const getChatHistory = (userId) => {
    return axios.get(`/api/get-chat-history?userId=${userId}`)
}
export default {
    handleLoginApi,
    registerUserService,
    getAllUsers,
    createUserService,
    deleteUserService,
    editUserService,
    getQuyDinhService,
    createNewUserService,
    getDoctorsHome,
    getDetailInforDoctor,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    getPatientHistory,
    getBookingByEmail,
    postVerifyCancelBooking,
    verifyCancelBooking,
    getPatientChatSummary,
    postChatbot,
    getChatHistory
}
