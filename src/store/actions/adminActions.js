import actionTypes from './actionTypes';
import { userService, doctorService } from '../../services';
import { toast } from "react-toastify";

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });

            let res = await userService.getQuyDinhService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart lỗi', e);
        }
    }
}

export const fetchGenderSuccess = (duLieuGioiTinh) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: duLieuGioiTinh
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getQuyDinhService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (e) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionStart lỗi', e);
        }
    }
}

export const fetchPositionSuccess = (duLieuViTri) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: duLieuViTri
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getQuyDinhService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleStart lỗi', e);
        }
    }
}

export const fetchRoleSuccess = (duLieuVaiTro) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: duLieuVaiTro
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Tạo người dùng thành công!");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Lỗi: " + res.message);
                dispatch(saveUserFailed());
            }
            return res;
        } catch (e) {
            toast.error("Lỗi hệ thống!");
            dispatch(saveUserFailed());
            console.log('createNewUser lỗi', e);
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users));
            } else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(fetchAllUsersFailed());
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

export const deleteUser = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.deleteUserService(id);
            if (res && res.errCode === 0) {
                toast.success("Xóa người dùng thành công!");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Xóa thất bại!");
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            toast.error("Lỗi hệ thống!");
            dispatch(deleteUserFailed());
            console.log('deleteUser lỗi', e);
        }
    }
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Cập nhật người dùng thành công!");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Cập nhật thất bại!");
                dispatch(editUserFailed());
            }
            return res;
        } catch (e) {
            toast.error("Lỗi cập nhật người dùng!");
            dispatch(editUserFailed());
            console.log('EditUser lỗi', e);
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_TOP_DOCTORS_START });

            let res = await userService.getDoctorsHome(10);

            if (res && res.errCode === 0) {
                dispatch(fetchTopDoctorSuccess(res.data));
            } else {
                dispatch(fetchTopDoctorFailed());
            }
        } catch (e) {
            console.log('FETCH_TOP_DOCTORS_FAILED', e);
            dispatch(fetchTopDoctorFailed());
        }
    }
}

export const fetchTopDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
    data: data
})

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTORS_FAILED
})

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await doctorService.getAllDoctorsService();

            if (res && res.errCode === 0) {

                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_DOCTORS_FAILED', e);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED
            })
        }
    }
}

export const saveInforDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await doctorService.saveDetailDoctorService(data);

            if (res && res.errCode === 0) {
                toast.success("Lưu thông tin bác sĩ thành công!");
                dispatch({
                    type: actionTypes.SAVE_INFOR_DOCTOR_SUCCESS,
                })
            } else {
                toast.error("Lưu thông tin thất bại!");
                console.log("Lỗi saveInforDoctor:", res);
                dispatch({
                    type: actionTypes.SAVE_INFOR_DOCTOR_FAILED
                })
            }

            return res;
        } catch (e) {
            toast.error("Lưu thông tin thất bại!");
            console.log('SAVE_INFOR_DOCTOR_FAILED:', e);
            dispatch({
                type: actionTypes.SAVE_INFOR_DOCTOR_FAILED
            })
        }
    }
}

export const fetchAllScheduleHour = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getQuyDinhService("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_QUYDINH_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_QUYDINH_SCHEDULE_TIME_FAILED
                })
            }
        } catch (e) {
            console.log('FETCH_QUYDINH_SCHEDULE_TIME_FAILED', e);
            dispatch({
                type: actionTypes.FETCH_QUYDINH_SCHEDULE_TIME_FAILED
            })
        }
    }
}