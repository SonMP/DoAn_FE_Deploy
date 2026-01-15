import axios from '../axios';

const getAllSpecialty = () => {
    return axios.get('/api/get-all-specialties');
}

const createSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data);
}

const getDetailSpecialtyById = (id) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${id}`);
}

const updateSpecialty = (data) => {
    return axios.put('/api/edit-specialty', data);
}

const deleteSpecialty = (specialtyId) => {
    return axios.delete('/api/delete-specialty', {
        data: {
            id: specialtyId
        }
    });
}

export default {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    updateSpecialty,
    deleteSpecialty
}