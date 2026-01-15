import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { doctorService, userService } from '../../../services';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify';
import RemedyModal from '../Doctor/Modal/RemedyModal';
import PatientHistory from '../../Patient/Doctor/PatientHistory';
import PatientHistoryModal from '../Doctor/Modal/PatientHistoryModal';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isShowLoading: false,
            isOpenRemedyModal: false,
            dataModal: {},
            isOpenHistoryModal: false,
            historyData: [],
            isOpenAIHistoryModal: false,
            dataAIModal: {}
        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await doctorService.getAllPatientForDoctor(user.id, formatedDate);

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient();
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.maBacSi,
            patientId: item.maBenhNhan,
            email: item.thongTinBenhNhan.email,
            timeType: item.khungThoiGian,
            patientName: item.thongTinBenhNhan.ten
        }

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({ isShowLoading: true });

        let res = await doctorService.postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            description: dataChild.note,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });

        if (res && res.errCode === 0) {
            this.setState({ isShowLoading: false });
            toast.success('Gửi hóa đơn thành công!');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            this.setState({ isShowLoading: false });
            toast.error('Lỗi khi gửi!');
            console.log('Error check:', res);
        }
    }

    getStatusClass = (status) => {
        const statusClassMap = {
            'S1': 'status-new',
            'S2': 'status-confirmed',
            'S3': 'status-done',
            'S4': 'status-cancel'
        }
        return statusClassMap[status] || '';
    }

    handleViewHistory = async (user) => {
        let patientId = user.maBenhNhan;
        let res = await userService.getPatientHistory(patientId);
        if (res && res.errCode === 0) {
            this.setState({
                isOpenHistoryModal: true,
                historyData: res.data
            })
        } else {
            toast.error('Lỗi không lấy được lịch sử khám bệnh!');
        }
    }

    toggleHistoryModal = () => {
        this.setState({
            isOpenHistoryModal: !this.state.isOpenHistoryModal
        })
    }

    handleOpenAIHistory = (patient) => {
        let data = {
            patientId: patient.maBenhNhan,
            patientName: patient.thongTinBenhNhan ? `${patient.thongTinBenhNhan.ho} ${patient.thongTinBenhNhan.ten}` : ''
        }
        this.setState({
            isOpenAIHistoryModal: true,
            dataAIModal: data
        })
    }

    toggleAIHistoryModal = () => {
        this.setState({ isOpenAIHistoryModal: !this.state.isOpenAIHistoryModal })
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isOpenHistoryModal, historyData, isOpenAIHistoryModal, dataAIModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className="manage-patient-modern">
                    <div className="mp-container">
                        <div className="mp-header">
                            <h2 className="title">Lịch trình hôm nay</h2>
                            <div className="date-filter">
                                <i className="far fa-calendar-alt"></i>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="custom-date-input"
                                    value={this.state.currentDate}
                                />
                            </div>
                        </div>

                        <div className="mp-body">
                            <div className="grid-list-patient">
                                {dataPatient && dataPatient.length > 0 ?
                                    dataPatient.map((item, index) => {
                                        let status = language === LANGUAGES.VI ?
                                            item.trangThaiData.giaTriVi : item.trangThaiData.giaTriEn;

                                        let timeDisplay = language === LANGUAGES.VI ?
                                            item.thoiGianData.giaTriVi : item.thoiGianData.giaTriEn;

                                        let gender = '';
                                        if (item.thongTinBenhNhan && item.thongTinBenhNhan.duLieuGioiTinh) {
                                            gender = language === LANGUAGES.VI ?
                                                item.thongTinBenhNhan.duLieuGioiTinh.giaTriVi : item.thongTinBenhNhan.duLieuGioiTinh.giaTriEn;
                                        }

                                        let fullName = item.thongTinBenhNhan ? `${item.thongTinBenhNhan.ho} ${item.thongTinBenhNhan.ten}` : '';
                                        let address = item.thongTinBenhNhan ? item.thongTinBenhNhan.diaChi : 'Chưa cập nhật';
                                        let reason = item.lyDo ? item.lyDo : 'Khám bệnh theo yêu cầu';

                                        return (
                                            <div className="patient-card-modern" key={index}>
                                                <div className="card-top-status">
                                                    <span className={`status-badge ${this.getStatusClass(item.maTrangThai)}`}>{status}</span>
                                                    <span className="time-badge">{timeDisplay}</span>
                                                </div>

                                                <div className="card-profile">
                                                    <div className="avatar-placeholder">
                                                        {fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="info">
                                                        <div className="name">{fullName}</div>
                                                        <div className="meta">
                                                            <span>{gender}</span>
                                                            <span className="dot">•</span>
                                                            <span className="address-truncate">{address}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card-reason">
                                                    <span className="label">Lý do khám:</span>
                                                    <p className="text">{reason}</p>
                                                </div>

                                                <div className="card-actions">
                                                    {item.maTrangThai === 'S2' ? (
                                                        <button className="btn-action btn-confirm"
                                                            onClick={() => this.handleBtnConfirm(item)}>
                                                            <i className="fas fa-file-invoice-dollar"></i> Gửi hóa đơn
                                                        </button>
                                                    ) : (
                                                        <button className="btn-action btn-disabled" disabled>
                                                            {item.maTrangThai === 'S3' ? 'Đã hoàn thành' : 'Đã hủy'}
                                                        </button>
                                                    )}

                                                    <button
                                                        className="btn-history"
                                                        style={{ marginLeft: '10px', background: '#f39c12', border: 'none' }}
                                                        onClick={() => this.handleViewHistory(item)}
                                                    >
                                                        Xem lịch sử
                                                    </button>

                                                    <button className="btn-history"
                                                        style={{ marginLeft: '10px', background: '#17a2b8', border: 'none' }}
                                                        onClick={() => this.handleOpenAIHistory(item)}>
                                                        <i className="fas fa-robot"></i> Bệnh án AI
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="no-data-container">
                                        <div className="illustration">📅</div>
                                        <p>Bác sĩ không có lịch hẹn nào vào ngày này.</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                    isShowLoading={this.state.isShowLoading}
                />

                <Modal
                    isOpen={isOpenHistoryModal}
                    toggle={() => this.toggleHistoryModal()}
                    className={'booking-modal-container'}
                    size="lg"
                    centered
                >
                    <ModalHeader toggle={() => this.toggleHistoryModal()}>
                        Lịch sử khám bệnh của {
                            historyData && historyData.length > 0 && historyData[0].benhNhanData
                                ? `${historyData[0].benhNhanData.ho} ${historyData[0].benhNhanData.ten}`
                                : ''
                        }
                    </ModalHeader>
                    <ModalBody>
                        <PatientHistory historyData={historyData} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleHistoryModal()}>Đóng</Button>
                    </ModalFooter>
                </Modal>

                <PatientHistoryModal
                    isOpen={isOpenAIHistoryModal}
                    toggle={this.toggleAIHistoryModal}
                    patientId={dataAIModal.patientId}
                    patientName={dataAIModal.patientName}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

export default connect(mapStateToProps)(ManagePatient);