import axios from '../axios';

const getAllSpecialty = (limit, page) => {
    let url = '/api/get-all-specialties';
    if (limit && page) {
        url += `?limit=${limit}&page=${page}`;
    }
    return axios.get(url);
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