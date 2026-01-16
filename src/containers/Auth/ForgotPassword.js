import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import './ForgotPassword.scss';
import { userService } from '../../services';
import { toast } from 'react-toastify';
import Spinner from 'react-spinkit';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false
        }
    }

    handleOnChangeInput = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleSendEmail = async () => {
        if (!this.state.email) {
            toast.error("Vui lòng nhập Email!");
            return;
        }

        this.setState({ isLoading: true });
        try {
            let res = await userService.postForgotPassword(this.state.email);
            if (res && res.errCode === 0) {
                toast.success("Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư!");
            } else {
                toast.error(res.message ? res.message : "Có lỗi xảy ra!");
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra khi gửi email!");
        }
        this.setState({ isLoading: false });
    }

    handleBack = () => {
        if (this.props.history) {
            this.props.history.push('/login');
        }
    }

    render() {
        let { email } = this.state;
        return (
            <div className="forgot-password-background">
                <div className="forgot-password-container">
                    <div className="forgot-password-content">
                        <div className="col-12 text-center title">Quên Mật Khẩu</div>
                        <div className="col-12 form-group">
                            <label>Nhập Email đã đăng ký:</label>
                            <input type="email" className="form-control"
                                placeholder="Email..."
                                value={email}
                                onChange={(event) => this.handleOnChangeInput(event)}
                            />
                        </div>
                        <div className="col-12 text-center">
                            <button
                                className="btn-send-email"
                                onClick={() => this.handleSendEmail()}
                                disabled={this.state.isLoading}
                            >
                                {this.state.isLoading && <i className="fas fa-spinner fa-spin"></i>}
                                {this.state.isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                        </div>
                        <div className="col-12 text-center mt-3">
                            <span className="back-login" onClick={() => this.handleBack()}>
                                <i className="fas fa-arrow-left"></i> Quay lại đăng nhập
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
