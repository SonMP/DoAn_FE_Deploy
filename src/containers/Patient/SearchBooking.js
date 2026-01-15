import React, { Component } from 'react';
import { connect } from "react-redux";
import './SearchBooking.scss';
import { userService } from '../../../src/services';
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { LANGUAGES } from '../../utils';

class SearchBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            dataBooking: [],
            isShowData: false,
            isLoading: false
        }
        this.refreshInterval = null;
    }

    componentDidMount() {
        window.addEventListener('focus', this.handleOnFocus);

        this.refreshInterval = setInterval(() => {
            if (this.state.email && this.state.isShowData) {
                this.handleSearch(true);
            }
        }, 30000);
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.handleOnFocus);
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    handleOnFocus = () => {
        if (this.state.email && this.state.isShowData) {
            this.handleSearch(true);
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    handleSearch = async (isBackground = false) => {
        if (!this.state.email) {
            if (!isBackground) toast.error("Vui lòng nhập địa chỉ Email!");
            return;
        }

        if (!isBackground) {
            this.setState({ isLoading: true });
        }

        let res = await userService.getBookingByEmail(this.state.email);

        if (res && res.errCode === 0) {
            this.setState({
                dataBooking: res.data,
                isShowData: true,
                isLoading: false
            })
        } else {
            this.setState({ isLoading: false });
            if (!isBackground) {
                toast.error("Không tìm thấy lịch hẹn hoặc lỗi từ hệ thống!");
            }
        }
    }

    handleCancel = (item) => {
        let doctorName = item.thongTinBacSi ? `${item.thongTinBacSi.ho} ${item.thongTinBacSi.ten}` : 'Bác sĩ';
        let time = item.thoiGianData ? item.thoiGianData.giaTriVi : '';
        let timeString = this.buildTimeBooking(item);
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn muốn hủy lịch khám với ${doctorName} vào lúc ${time}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Gửi yêu cầu hủy',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                this.setState({ isLoading: true });

                let patientInfo = item.thongTinBenhNhan || {};
                let customerName = `${patientInfo.ho || ''} ${patientInfo.ten || ''}`.trim();
                let res = await userService.postVerifyCancelBooking({
                    doctorId: item.maBacSi,
                    patientId: item.maBenhNhan,
                    email: this.state.email,
                    timeType: item.khungThoiGian,
                    language: this.props.language,
                    customerName: customerName,
                    timeString: timeString,
                });

                if (res && res.errCode === 0) {
                    this.setState({ isLoading: false });

                    Swal.fire(
                        'Đã gửi yêu cầu!',
                        'Vui lòng kiểm tra email để xác nhận hủy lịch hẹn.',
                        'info'
                    );
                } else {
                    this.setState({ isLoading: false });
                    toast.error(res.errMessage);
                }
            }
        })
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

    handleRebook = (item) => {
        if (this.props.history && item.maBacSi) {
            this.props.history.push(`/detail-doctor/${item.maBacSi}`);
        }
    }

    render() {
        let { email, dataBooking, isShowData, isLoading } = this.state;
        let { language } = this.props;

        return (
            <LoadingOverlay active={isLoading} spinner text='Đang xử lý...'
                styles={{
                    spinner: (base) => ({
                        ...base,
                        width: '60px',
                        '& svg circle': {
                            stroke: '#007f5f'
                        }
                    }),
                    content: (base) => ({
                        ...base,
                        color: '#007f5f',
                        fontWeight: 'bold'
                    }),
                    overlay: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.7)'
                    })
                }}
            >
                <div className="search-booking-container">
                    <div className="search-hero">
                        <div className="search-content">
                            <h2 className="title">QUẢN LÝ LỊCH KHÁM</h2>
                            <p className="subtitle">Nhập email để xem lịch sử và trạng thái cuộc hẹn của bạn</p>

                            <div className="search-input-wrapper">
                                <input
                                    type="email"
                                    className="search-input"
                                    placeholder="Nhập địa chỉ Email của bạn..."
                                    value={email}
                                    onChange={(e) => this.handleOnChangeEmail(e)}
                                    onKeyDown={(e) => e.key === 'Enter' && this.handleSearch()}
                                />
                                <button className="btn-search" onClick={() => this.handleSearch()}>
                                    <i className="fas fa-search"></i> Tra cứu
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="result-content-container">
                        {!isShowData ? (
                            <div className="intro-section">
                                <h3 className="intro-title">Quy trình tra cứu đơn giản</h3>
                                <div className="steps-container">
                                    <div className="step-item">
                                        <div className="step-icon"><i className="fas fa-keyboard"></i></div>
                                        <div className="step-text">Nhập Email đã đặt lịch</div>
                                    </div>
                                    <div className="step-arrow"><i className="fas fa-arrow-right"></i></div>
                                    <div className="step-item">
                                        <div className="step-icon"><i className="fas fa-search-location"></i></div>
                                        <div className="step-text">Kiểm tra thông tin</div>
                                    </div>
                                    <div className="step-arrow"><i className="fas fa-arrow-right"></i></div>
                                    <div className="step-item">
                                        <div className="step-icon"><i className="fas fa-check-circle"></i></div>
                                        <div className="step-text">Quản lý lịch hẹn</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {dataBooking && dataBooking.length > 0 ?
                                    dataBooking.map((item, index) => {
                                        let doctorInfo = item.thongTinBacSi || {};
                                        let timeData = item.thoiGianData || {};
                                        let statusData = item.trangThaiData || {};

                                        let doctorName = `${doctorInfo.ho} ${doctorInfo.ten}`;
                                        let date = moment(item.ngayHen).format('DD/MM/YYYY');
                                        let time = language === 'vi' ? timeData.giaTriVi : timeData.giaTriEn;
                                        let statusLabel = language === 'vi' ? statusData.giaTriVi : statusData.giaTriEn;

                                        let isCancelable = item.maTrangThai === 'S1' || item.maTrangThai === 'S2';

                                        return (
                                            <div className="booking-card" key={index}>
                                                <div className="card-left">
                                                    <div className="doctor-icon"><i className="fas fa-user-md"></i></div>
                                                    <div className="doctor-details">
                                                        <div className="doctor-name">BS. {doctorName}</div>
                                                        <div className="doctor-address"><i className="fas fa-map-marker-alt"></i> {doctorInfo.diaChi}</div>
                                                        <div className="doctor-phone"><i className="fas fa-phone-alt"></i> {doctorInfo.soDienThoai}</div>
                                                    </div>
                                                </div>

                                                <div className="card-center">
                                                    <div className="time-badge"><i className="far fa-clock"></i> {time} - {date}</div>
                                                    <div className={`status-badge ${item.maTrangThai}`}>
                                                        {statusLabel}
                                                    </div>
                                                </div>

                                                <div className="card-right">
                                                    <button
                                                        className="btn-action btn-rebook"
                                                        onClick={() => this.handleRebook(item)}
                                                    >
                                                        <i className="fas fa-sync-alt"></i> Đặt lại
                                                    </button>

                                                    <button
                                                        className={`btn-action btn-cancel ${!isCancelable ? 'disabled-btn' : ''}`}
                                                        onClick={() => isCancelable && this.handleCancel(item)}
                                                        disabled={!isCancelable}
                                                    >
                                                        <i className="fas fa-trash-alt"></i> Hủy lịch
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    : <div className="no-data">
                                        <i className="far fa-folder-open"></i>
                                        <p>Không tìm thấy lịch hẹn nào với email này.</p>
                                    </div>
                                }
                            </>
                        )}
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(SearchBooking);