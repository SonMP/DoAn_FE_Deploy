import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './Feedback.scss';

// Import ảnh (Bạn thay bằng ảnh thật của bạn)
import feedbackImg1 from '../../../assets/images/bacsimau.jpg'; // Ảnh khách 1
import surgeryImg from '../../../assets/images/chuyenkhoa.jpg'; // Ảnh mổ bướu cổ

class Feedback extends Component {

    render() {
        return (
            <div className="section-share section-feedback">
                <div className="section-container">
                    <div className="feedback-layout">

                        {/* --- CỘT TRÁI: PHẢN HỒI KHÁCH HÀNG (GRID 4 Ô) --- */}
                        <div className="left-content">
                            <div className="section-header">
                                <span className="title-section">
                                    <FormattedMessage id="feedback.title" />
                                </span>
                            </div>

                            <div className="feedback-list">
                                {/* Feedback 1 */}
                                <div className="feedback-item">
                                    <div className="avatar" style={{ backgroundImage: `url(${feedbackImg1})` }}></div>
                                    <div className="content">
                                        <div className="name">BẢO TIỂU BỘI - TP.HCM</div>
                                        <div className="desc">
                                            "Tôi không có cảm giác đau đớn gì, chỉ như kiến cắn thôi. Sau khi điều trị xong tui thấy người khỏe hẳn, ăn uống dễ dàng."
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback 2 */}
                                <div className="feedback-item">
                                    <div className="avatar" style={{ backgroundImage: `url(${feedbackImg1})` }}></div>
                                    <div className="content">
                                        <div className="name">CHỊ N.T.HƯƠNG 33 TUỔI</div>
                                        <div className="desc">
                                            "Tôi thấy nhân viên tại Bệnh viện phục vụ rất tận tình, vui vẻ. Các bác sĩ giải thích bệnh rất kỹ, hết sức nhiệt tình."
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback 3 */}
                                <div className="feedback-item">
                                    <div className="avatar" style={{ backgroundImage: `url(${feedbackImg1})` }}></div>
                                    <div className="content">
                                        <div className="name">LÊ THIÊN THANH - VĨNH LONG</div>
                                        <div className="desc">
                                            "Như rất nhiều bệnh nhân bướu giáp nhân khác, tôi rất lo lắng phải mổ. Nhờ các bác sĩ tư vấn, tôi đã chữa khỏi bệnh nhanh chóng."
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback 4 */}
                                <div className="feedback-item">
                                    <div className="avatar" style={{ backgroundImage: `url(${feedbackImg1})` }}></div>
                                    <div className="content">
                                        <div className="name">NGUYỄN THANH TÙNG, 35 TUỔI</div>
                                        <div className="desc">
                                            "Mong các bác sĩ tại Bệnh viện Đa Khoa Bình Dân luôn khỏe mạnh để có thêm nhiều bệnh nhân được chữa khỏi bệnh bướu cổ."
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- CỘT PHẢI: THÔNG TIN BÊN LỀ --- */}
                        <div className="right-content">

                            {/* Khối 1: Mổ bướu cổ */}
                            <div className="info-box surgery-box">
                                <h3 className="box-title"><FormattedMessage id="feedback.thyroid_title" /></h3>
                                <p className="box-desc"><FormattedMessage id="feedback.thyroid_desc" /></p>
                                <div className="box-img" style={{ backgroundImage: `url(${surgeryImg})` }}></div>
                            </div>

                            {/* Khối 2: Danh sách bác sĩ tư vấn */}
                            <div className="info-box doctor-list-box">
                                <h3 className="box-title bg-blue"><FormattedMessage id="feedback.consulting_doctor" /></h3>
                                <ul className="list-doctors">
                                    <li>
                                        <span className="dr-name">Bác sĩ Hằng: 0913 415 229</span>
                                        <span className="dr-spec"><FormattedMessage id="feedback.internal_medicine" /></span>
                                    </li>
                                    <li>
                                        <span className="dr-name">Bác sĩ Hạnh: 0905 200 232</span>
                                        <span className="dr-spec"><FormattedMessage id="feedback.pediatrics" /></span>
                                    </li>
                                    <li>
                                        <span className="dr-name">Bác sĩ Ngân: 0903 587 920</span>
                                        <span className="dr-spec"><FormattedMessage id="feedback.surgery" /></span>
                                    </li>
                                    <li>
                                        <span className="dr-name">Bác sĩ Thủy: 0934 999 556</span>
                                        <span className="dr-spec"><FormattedMessage id="feedback.vaccination" /></span>
                                    </li>
                                </ul>
                            </div>

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

export default connect(mapStateToProps)(Feedback);