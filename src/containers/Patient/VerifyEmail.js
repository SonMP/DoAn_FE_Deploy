import React, { Component } from 'react';
import { connect } from "react-redux";
import { userService } from '../../services';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';

class VerifyEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
            isCancel: false
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let isCancel = urlParams.get('isCancel');

            let res;

            if (isCancel === 'true') {
                this.setState({ isCancel: true });
                res = await userService.verifyCancelBooking({
                    token: token,
                    doctorId: doctorId
                });
            } else {
                res = await userService.postVerifyBookAppointment({
                    token: token,
                    doctorId: doctorId
                });
            }

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: 0
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    render() {
        let { statusVerify, errCode, isCancel } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="verify-email-container">
                    <div className="verify-card">
                        {statusVerify === false ?
                            <div className="verify-state loading">
                                <div className="spinner"></div>
                                <div className="text">Đang xử lý dữ liệu...</div>
                                <div className="sub-text">Vui lòng chờ trong giây lát</div>
                            </div>
                            :
                            <div className="verify-state result">
                                {+errCode === 0 ?
                                    <>
                                        <div className="icon-box success">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <div className="title success">
                                            {isCancel ? "Hủy lịch hẹn thành công!" : "Xác nhận thành công!"}
                                        </div>
                                        <div className="description">
                                            {isCancel ?
                                                "Yêu cầu hủy lịch khám của bạn đã được xử lý thành công." :
                                                <>
                                                    Lịch hẹn của bạn đã được xác nhận trên hệ thống.
                                                    <br />Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ.
                                                </>
                                            }
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="icon-box error">
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <div className="title error">
                                            {isCancel ? "Hủy lịch thất bại!" : "Xác nhận thất bại!"}
                                        </div>
                                        <div className="description">
                                            {+errCode === 3 ?
                                                <span>Lịch khám này vừa được người khác xác nhận. Vui lòng chọn lịch khác!</span>
                                                :
                                                <span>
                                                    {isCancel ?
                                                        "Lịch hẹn này không tồn tại hoặc đã bị hủy trước đó." :
                                                        "Lịch hẹn này không tồn tại hoặc đã được xác nhận trước đó."
                                                    }
                                                </span>
                                            }
                                            <br />Vui lòng kiểm tra lại thông tin.
                                        </div>
                                    </>
                                }
                                <button className="btn-home" onClick={() => this.props.history.push('/trangchu')}>
                                    Về trang chủ
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

export default connect(mapStateToProps)(VerifyEmail);