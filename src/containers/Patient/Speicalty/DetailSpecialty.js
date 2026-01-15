import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { specialtyService } from '../../../services';
import { LANGUAGES } from '../../../utils';

class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: [],
            dataDetailSpecialty: {},
            isExpandDescription: false
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.getDataDetailSpecialty(id);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            let id = this.props.match.params.id;

            this.setState({
                arrDoctor: [],
                dataDetailSpecialty: {}
            });
            this.getDataDetailSpecialty(id);
        }
    }

    getDataDetailSpecialty = async (id) => {
        let res = await specialtyService.getDetailSpecialtyById(id);

        if (res && res.errCode === 0) {
            let data = res.data;
            let arrDoctor = [];
            if (data && data.danhSachBacSi) {
                arrDoctor = data.danhSachBacSi;
            }

            this.setState({
                dataDetailSpecialty: res.data,
                arrDoctor: arrDoctor,
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.maBacSi}`);
        }
    }

    toggleDescription = () => {
        this.setState({ isExpandDescription: !this.state.isExpandDescription });
    }

    render() {
        let { arrDoctor, dataDetailSpecialty, isExpandDescription } = this.state;
        let { language } = this.props;
        return (
            <div className="detail-specialty-container">
                {/* --- 1. HERO BANNER --- */}
                <div className="description-specialty">
                    <div className="hero-overlay" style={{ backgroundImage: `url(${dataDetailSpecialty.hinhAnh})` }}></div>
                    <div className="hero-content container">
                        <div className="hero-text">
                            <h1 className="spec-title">{dataDetailSpecialty.ten}</h1>
                            <div className="spec-short-desc">
                                {dataDetailSpecialty.moTa}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detail-specialty-body container">

                    <div className="specialty-intro-card">
                        <div className="card-header-custom">Thông tin chi tiết</div>
                        <div className={isExpandDescription ? "html-content expanded" : "html-content collapsed"}
                            dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.noiDungHTML }}
                        ></div>
                        <div className="toggle-btn" onClick={() => this.toggleDescription()}>
                            {isExpandDescription ? "Thu gọn" : "Đọc thêm"}
                        </div>
                    </div>

                    <div className="doctor-section">
                        <div className="section-header-simple">
                            <span className="title-section">Đội ngũ Bác sĩ</span>
                            <span className="subtitle-section">Các chuyên gia hàng đầu tại bệnh viện</span>
                        </div>

                        <div className="doctor-grid">
                            {arrDoctor && arrDoctor.length > 0 ?
                                arrDoctor.map((item, index) => {
                                    let userProfile = item.thongTinNguoiDung;
                                    if (!userProfile) return null;

                                    let nameVi = `${userProfile.ho} ${userProfile.ten}`;
                                    let nameEn = `${userProfile.ten} ${userProfile.ho}`;

                                    return (
                                        <div className="doctor-profile-card" key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="avatar-wrapper">

                                                <div className="doctor-avatar"
                                                    style={{ backgroundImage: `url(${userProfile.hinhAnh})` }}
                                                />
                                            </div>
                                            <div className="doctor-info">
                                                <div className="doctor-name">
                                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                                </div>
                                                <div className="doctor-role">
                                                    {dataDetailSpecialty.ten}
                                                </div>
                                                <div className="doctor-price">
                                                    <i className="fas fa-tag"></i>
                                                    {language === LANGUAGES.VI
                                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.donGia)
                                                        : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.donGia)
                                                    }
                                                </div>
                                                <button className="btn-view-profile">
                                                    Đặt lịch khám
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-doctor">Hiện chưa có bác sĩ thuộc chuyên khoa này...</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

export default connect(mapStateToProps)(DetailSpecialty);