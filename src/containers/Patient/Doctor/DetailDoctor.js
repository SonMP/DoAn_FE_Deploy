import React, { Component } from 'react';
import { connect } from "react-redux";
import { userService } from '../../../services';
import './DetailDoctor.scss';
import DoctorSchedule from '../../System/Doctor/DoctorSchedule';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1
        }
        this.scheduleRef = React.createRef();
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({ currentDoctorId: id });

            let res = await userService.getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({ detailDoctor: res.data })
            }
        }
    }

    handleBtnBookingClick = () => {
        const section = document.getElementById('doctor-schedule-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (this.scheduleRef && this.scheduleRef.current) {
            this.scheduleRef.current.openNearestSchedule();
        }
    }

    buildDoctorName = (detailDoctor) => {
        let { language } = this.props;
        if (detailDoctor && detailDoctor.duLieuViTri) {
            let nameVi = `${detailDoctor.duLieuViTri.giaTriVi}, ${detailDoctor.ho} ${detailDoctor.ten}`;
            let nameEn = `${detailDoctor.duLieuViTri.giaTriEn}, ${detailDoctor.ten} ${detailDoctor.ho}`;
            return language === 'vi' ? nameVi : nameEn;
        }
        return '';
    }

    renderPrice = (detailDoctor) => {
        let { language } = this.props;

        if (detailDoctor && detailDoctor.thongTinChiTiet && detailDoctor.thongTinChiTiet.donGia) {
            let price = detailDoctor.thongTinChiTiet.donGia;

            let formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

            return `${formattedPrice} VNĐ`;
        }

        return language === 'vi' ? 'Chưa có giá' : 'N/A';
    }

    render() {
        let { detailDoctor, currentDoctorId } = this.state;
        let { language } = this.props;
        let name = this.buildDoctorName(detailDoctor);

        let description = detailDoctor?.thongTinChiTiet?.moTa || '';
        let contentHTML = detailDoctor?.thongTinChiTiet?.noiDungHTML || '';
        let address = detailDoctor?.diaChi || 'Phòng khám Đa khoa Quốc tế';
        let avatarUrl = detailDoctor?.hinhAnh || '';

        return (
            <div className="doctor-detail-container">

                <div className="doctor-hero-section">
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-avatar"
                                style={{ backgroundImage: `url(${avatarUrl})` }}>
                            </div>
                            <div className="hero-info">
                                <h1 className="doctor-name">{name}</h1>
                                <p className="doctor-desc">{description}</p>
                                <div className="hero-actions">
                                    <button className="btn-action btn-booking"
                                        onClick={() => this.handleBtnBookingClick()}
                                    >
                                        <i className="fas fa-calendar-check"></i>
                                        {language === 'vi' ? 'Đặt lịch ngay' : 'Book Now'}
                                    </button>
                                    <button className="btn-action btn-message">
                                        <i className="fab fa-facebook-messenger"></i>
                                        {language === 'vi' ? 'Nhắn tin' : 'Message'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="doctor-body-section">
                    <div className="container">
                        <div className="body-grid">

                            <div className="left-column">
                                <div className="content-card schedule-card" id="doctor-schedule-section">
                                    <DoctorSchedule
                                        doctorIdFromParent={currentDoctorId}
                                        priceDoctor={this.renderPrice(detailDoctor)}
                                        detailDoctorFromParent={detailDoctor}
                                        ref={this.scheduleRef}
                                        doctorIdFromDetail={this.state.currentDoctorId}
                                    />
                                </div>

                                <div className="content-card clinic-info-card">
                                    <div className="card-header">
                                        <i className="fas fa-map-marked-alt"></i>
                                        <span>{language === 'vi' ? 'Địa chỉ khám' : 'Address'}</span>
                                    </div>
                                    <div className="clinic-address">
                                        <h4>Bệnh viện Bình Dân Đà Nẵng</h4>
                                        <p>{address}</p>
                                    </div>
                                    <div className="clinic-price-preview">
                                        <span>{language === 'vi' ? 'Giá khám:' : 'Price:'}</span>
                                        <span className="price">
                                            {this.renderPrice(detailDoctor)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="right-column">
                                <div className="content-card detail-card">
                                    <div className="card-header-simple">
                                        <h3>{language === 'vi' ? 'Thông tin chi tiết' : 'Biography'}</h3>
                                    </div>

                                    <div className="markdown-content">
                                        {contentHTML ?
                                            <div dangerouslySetInnerHTML={{ __html: contentHTML }}></div>
                                            :
                                            <div className="no-data">
                                                {language === 'vi' ? 'Chưa có thông tin cập nhật.' : 'No information available.'}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DetailDoctor);