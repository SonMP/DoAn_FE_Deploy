import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import './Doctor.scss';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: []
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.doctorsRedux !== this.props.doctorsRedux) {
            this.setState({
                arrDoctors: this.props.doctorsRedux
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    handleLoadMore = () => {
        this.props.history.push('/all-doctors');
    }

    render() {
        let { arrDoctors } = this.state;
        let { language, settings } = this.props;

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="section.outstanding_doctor" defaultMessage="Đội ngũ chuyên gia" />
                        </span>
                        <button className="btn-section" onClick={() => this.handleLoadMore()}>
                            <FormattedMessage id="section.view_all" defaultMessage="Xem tất cả" />
                        </button>
                    </div>

                    <div className="section-body">
                        <Slider {...settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let imageBase64 = item.hinhAnh;
                                    let nameVi = `${item.duLieuViTri.giaTriVi}, ${item.ho} ${item.ten}`;
                                    let nameEn = `${item.duLieuViTri.giaTriEn}, ${item.ten} ${item.ho}`;

                                    let tenChuyenKhoa = '';
                                    if (item.thongTinChiTiet && item.thongTinChiTiet.danhSachChuyenKhoa) {
                                        tenChuyenKhoa = item.thongTinChiTiet.danhSachChuyenKhoa.map(ck => ck.ten).join(', ');
                                    }
                                    if (!tenChuyenKhoa) {
                                        tenChuyenKhoa = 'Chuyên khoa khác';
                                    }
                                    return (
                                        <div className="doctor-card-wrapper" key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="doctor-card-content">
                                                <div className="outer-bg">
                                                    <div className="bg-image section-doctor-bg"
                                                        style={{ backgroundImage: `url(${imageBase64})` }}>
                                                    </div>
                                                </div>

                                                <div className="position text-center">
                                                    <div className="doctor-name">
                                                        {language === LANGUAGES.VI ? nameVi : nameEn}
                                                    </div>
                                                    <div className="doctor-specialty">
                                                        {tenChuyenKhoa}
                                                    </div>
                                                    <div className="action-btn">
                                                        <button className="btn-booking">
                                                            <FormattedMessage id="section.btn_book_now" defaultMessage="Đặt lịch" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        doctorsRedux: state.admin.doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Doctor));