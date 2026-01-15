import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeContent.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import bannerBg from '../../assets/images/banner0.jpg';
import bannerBg2 from '../../assets/images/banner1.jpg';
import bannerBg3 from '../../assets/images/banner2.jpg';

const bannerImages = [bannerBg, bannerBg2, bannerBg3];

class HomeContent extends Component {

    handleLoadAllDoctors = () => {
        if (this.props.history) {
            this.props.history.push('/all-doctors');
        }
    }


    render() {
        let settingsBanner = {
            dots: false, arrows: false, infinite: true, speed: 1000,
            autoplay: true, autoplaySpeed: 4000, slidesToShow: 1,
            slidesToScroll: 1, fade: false, cssEase: 'linear'
        };

        return (
            <React.Fragment>
                <div className="home-banner-modern">
                    <div className="banner-slider-wrapper">
                        <Slider {...settingsBanner}>
                            {bannerImages.map((item, index) => {
                                return (
                                    <div className="banner-slide-item" key={index}>
                                        <div className="banner-bg-img" style={{ backgroundImage: `url(${item})` }}></div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                    <div className="banner-overlay"></div>

                    <div className="banner-content-left">
                        <div className="hospital-name">
                            <FormattedMessage id="banner.hospital_name" defaultMessage="BỆNH VIỆN BÌNH DÂN ĐÀ NẴNG" />
                        </div>
                        <div className="slogan">
                            <FormattedMessage id="banner.slogan" defaultMessage="Chuyên môn hàng đầu - Y đức vẹn toàn" />
                        </div>
                        <div className="desc">
                            <FormattedMessage id="banner.desc" />
                        </div>
                        <button className="btn-explore">
                            <FormattedMessage id="banner.btn_explore" defaultMessage="Tìm hiểu thêm" />
                        </button>
                    </div>
                </div>

                <div className="info-cards-container">
                    <div className="info-card-item card-schedule"
                        onClick={() => this.handleLoadAllDoctors()}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="far fa-calendar-alt"></i>
                        <h3><FormattedMessage id="section.booking" defaultMessage="Đặt lịch khám" /></h3>
                        <p><FormattedMessage id="section.book_desc" defaultMessage="Chủ động thời gian" /></p>
                    </div>
                    <div className="info-card-item card-emergency">
                        <i className="fas fa-ambulance"></i>
                        <h3><FormattedMessage id="section.emergency" defaultMessage="Cấp cứu 24/7" /></h3>
                        <p><FormattedMessage id="section.hotline" defaultMessage="Hotline..." /></p>
                    </div>
                    <div className="info-card-item card-doctors"
                        onClick={() => this.handleLoadAllDoctors()}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="fas fa-user-md"></i>
                        <h3><FormattedMessage id="section.expert_team" defaultMessage="Đội ngũ Bác sĩ" /></h3>
                        <p><FormattedMessage id="section.expert_desc" defaultMessage="Chuyên gia đầu ngành" /></p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(HomeContent));