import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import './Service.scss';

import serviceImg1 from '../../../assets/images/chuyenkhoa.jpg';
import serviceImg2 from '../../../assets/images/bacsimau.jpg';

class Service extends Component {

    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } }
            ]
        };

        return (
            <div className="section-share section-service">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="section.service_consultation" defaultMessage="Tư vấn dịch vụ" />
                        </span>
                    </div>

                    <div className="section-body">
                        <Slider {...settings}>

                            {/* ITEM 1 */}
                            <div className="service-card">
                                <div className="card-inner">
                                    <div className="card-top">
                                        <div className="bg-image" style={{ backgroundImage: `url(${serviceImg1})` }}></div>
                                        {/* Date Badge */}
                                        <div className="date-badge">
                                            <span className="day">05</span>
                                            <span className="month">Th12</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">Ưu đãi đặc biệt: Khám chữa bệnh áp dụng BHYT</h3>
                                        <p className="card-desc">
                                            Trong tinh thần đồng hành cùng người dân vượt qua khó khăn do thiên tai lũ lụt,
                                            Bệnh viện Bình Dân Đà Nẵng triển khai ưu đãi dành riêng...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ITEM 2 */}
                            <div className="service-card">
                                <div className="card-inner">
                                    <div className="card-top">
                                        <div className="bg-image" style={{ backgroundImage: `url(${serviceImg2})` }}></div>
                                        <div className="date-badge">
                                            <span className="day">05</span>
                                            <span className="month">Th3</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">Siêu âm tuyến giáp có chính xác không?</h3>
                                        <p className="card-desc">
                                            Tuyến giáp là một tuyến nội tiết quan trọng, nằm ở vùng cổ trước, nằm áp vào mặt trước bên
                                            của sụn giáp và phần trên khí quản...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ITEM 3 */}
                            <div className="service-card">
                                <div className="card-inner">
                                    <div className="card-top">
                                        <div className="bg-image" style={{ backgroundImage: `url(${serviceImg1})` }}></div>
                                        <div className="date-badge">
                                            <span className="day">24</span>
                                            <span className="month">Th2</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">Khám Sức Khoẻ Xin Việc Tại Bệnh Viện BÌNH DÂN ĐÀ NẴNG</h3>
                                        <p className="card-desc">
                                            KHÁM SỨC KHOẺ XIN VIỆC Ở ĐÂU? NHỮNG ĐIỀU QUAN TRỌNG CẦN LƯU Ý.
                                            Giấy khám sức khoẻ là một trong những thủ tục cần thiết...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ITEM 4 (Thêm để test slider) */}
                            <div className="service-card">
                                <div className="card-inner">
                                    <div className="card-top">
                                        <div className="bg-image" style={{ backgroundImage: `url(${serviceImg2})` }}></div>
                                        <div className="date-badge">
                                            <span className="day">10</span>
                                            <span className="month">Th5</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">Tầm soát ung thư sớm</h3>
                                        <p className="card-desc">
                                            Gói khám tầm soát ung thư giúp phát hiện bệnh ở giai đoạn sớm,
                                            tăng tỷ lệ điều trị thành công...
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

export default connect(mapStateToProps)(Service);