import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from "../../../../store/actions";
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { userService } from '../../../../services';
import { toast } from "react-toastify";
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hoTen: '',
            soDienThoai: '',
            email: '',
            diaChi: '',
            lyDo: '',
            ngaySinh: '',
            selectedGender: '',
            maBacSi: '',

            genders: '',
            timeType: '',

            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }

        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }

        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.maBacSi;
                let timeType = this.props.dataTime.khungThoiGian;
                this.setState({
                    maBacSi: doctorId,
                    timeType: timeType
                })
            }
        }

        if (this.props.isOpenModal !== prevProps.isOpenModal) {
            if (this.props.isOpenModal === true) {
                let { userInfo } = this.props;

                if (userInfo && userInfo.email) {
                    let name = '';
                    if (userInfo.ho && userInfo.ten) {
                        name = `${userInfo.ho} ${userInfo.ten}`;
                    } else {
                        name = userInfo.ten || userInfo.ho || '';
                    }

                    this.setState({
                        hoTen: name,
                        soDienThoai: userInfo.soDienThoai ? userInfo.soDienThoai : '',
                        email: userInfo.email ? userInfo.email : '',
                        diaChi: userInfo.diaChi ? userInfo.diaChi : '',
                        lyDo: '',
                        ngaySinh: '',
                        selectedGender: userInfo.gioiTinh ? userInfo.gioiTinh : '',

                    })
                } else {
                    this.setState({
                        fullName: '',
                        phoneNumber: '',
                        email: '',
                        address: '',
                        reason: '',
                        selectedGender: '',
                        birthday: ''
                    })
                }
            }
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.giaTriVi : item.giaTriEn;
                object.value = item.khoa;
                result.push(object)
            })
        }
        return result;
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            ngaySinh: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    handleConfirmBooking = async () => {
        let { hoTen, soDienThoai, email, diaChi, lyDo, ngaySinh, selectedGender, maBacSi, timeType } = this.state;
        if (!hoTen || !soDienThoai || !email || !selectedGender || !ngaySinh) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        this.setState({ isShowLoading: true });

        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let date = new Date(this.state.ngaySinh).getTime();

        let data = {
            fullName: hoTen,
            phoneNumber: soDienThoai,
            email: email,
            address: diaChi,
            reason: lyDo,
            date: this.props.dataTime.ngayHen,
            birthday: date,
            selectedGender: selectedGender.value,
            doctorId: maBacSi,
            timeType: timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        }

        try {
            let res = await userService.postPatientBookAppointment(data);

            if (res && res.errCode === 0) {
                toast.success("Đặt lịch thành công! Vui lòng kiểm tra email.");
                this.setState({
                    lyDo: '',
                    ngaySinh: '',
                })
                this.props.closeBookingClose();
            } else if (res && res.errCode === 2) {
                toast.warn("Bạn đã đặt lịch hẹn này rồi! Vui lòng kiểm tra lại.");
            } else {

                toast.error(res.errMessage || "Lỗi đặt lịch!");
            }
        } catch (e) {
            console.log(e)
        }
        this.setState({ isShowLoading: false });
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime) && dataTime.thoiGianData) {
            let date = '';
            if (!isNaN(dataTime.ngayHen)) {
                date = new Date(Number(dataTime.ngayHen));
            } else {
                date = new Date(dataTime.ngayHen);
            }

            let time = language === LANGUAGES.VI ?
                dataTime.thoiGianData.giaTriVi : dataTime.thoiGianData.giaTriEn;

            let dateString = language === LANGUAGES.VI ?
                moment(date).format('dddd - DD/MM/YYYY')
                :
                moment(date).locale('en').format('ddd - MM/DD/YYYY');

            return `${time} : ${dateString}`;
        }
        return '';
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime) && dataTime.bacSiData) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.bacSiData.ho} ${dataTime.bacSiData.ten}`
                :
                `${dataTime.bacSiData.ten} ${dataTime.bacSiData.ho}`;
            return name;
        }
        return '';
    }

    render() {
        let { isOpenModal, closeBookingClose, dataTime, price, detailDoctorFromParent } = this.props;
        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="lg"
                centered
            >
                <div className="booking-modal-content">

                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" defaultMessage="Thông tin đặt lịch khám bệnh" />
                        </span>
                        <span className="right" onClick={closeBookingClose}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    {this.state.isShowLoading === true &&
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <div className="text">Đang xử lý...</div>
                        </div>
                    }
                    <div className="booking-modal-body">
                        <div className="doctor-info-summary">
                            <div className="doctor-avatar"
                                style={{ backgroundImage: `url(${detailDoctorFromParent?.hinhAnh || ''})` }}
                            ></div>

                            <div className="doctor-content">
                                <h3 className="doctor-name">
                                    {this.buildDoctorName(dataTime)}
                                </h3>
                                <div className="booking-time">
                                    <i className="far fa-clock"></i>
                                    {this.buildTimeBooking(dataTime)}
                                </div>
                                <div className="booking-price">
                                    <i className="fas fa-tag"></i>
                                    <FormattedMessage id="patient.booking-modal.price" defaultMessage="Giá khám:" />
                                    <span className="price-tag"> {price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.fullName" defaultMessage="Họ tên bệnh nhân" /></label>
                                <input className="form-control"
                                    value={this.state.hoTen}
                                    onChange={(event) => this.handleOnChangeInput(event, 'hoTen')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.phoneNumber" defaultMessage="Số điện thoại" /></label>
                                <input className="form-control"
                                    value={this.state.soDienThoai}
                                    onChange={(event) => this.handleOnChangeInput(event, 'soDienThoai')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.email" defaultMessage="Địa chỉ Email" /></label>
                                <input className="form-control"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.address" defaultMessage="Địa chỉ liên hệ" /></label>
                                <input className="form-control"
                                    value={this.state.diaChi}
                                    onChange={(event) => this.handleOnChangeInput(event, 'diaChi')}
                                />
                            </div>

                            <div className="col-12 form-group">
                                <label><FormattedMessage id="patient.booking-modal.reason" defaultMessage="Lý do khám" /></label>
                                <input className="form-control"
                                    value={this.state.lyDo}
                                    onChange={(event) => this.handleOnChangeInput(event, 'lyDo')}
                                />
                            </div>

                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.birthday" defaultMessage="Ngày sinh" /></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.ngaySinh}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.gender" defaultMessage="Giới tính" /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm" onClick={() => this.handleConfirmBooking()} disabled={this.state.isShowLoading}>
                            <FormattedMessage id="patient.booking-modal.btnConfirm" defaultMessage="Xác nhận đặt lịch" />
                        </button>
                        <button className="btn-booking-cancel" onClick={closeBookingClose} disabled={this.state.isShowLoading}>
                            <FormattedMessage id="patient.booking-modal.btnCancel" defaultMessage="Hủy" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);