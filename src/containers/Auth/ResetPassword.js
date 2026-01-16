import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import './ForgotPassword.scss'; // Reuse styles
import { userService } from '../../services';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import Spinner from 'react-spinkit';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            token: '',
            isLoading: false
        }
    }

    componentDidMount() {
        // Extract token from URL
        let search = new URLSearchParams(this.props.location.search);
        let token = search.get("token");
        if (token) {
            this.setState({ token: token });
        } else {
            toast.error("Token không hợp lệ!");
        }
    }

    handleOnChangeInput = (event) => {
        this.setState({
            newPassword: event.target.value
        })
    }

    handleReset = async () => {
        if (!this.state.newPassword) {
            toast.error("Vui lòng nhập mật khẩu mới!");
            return;
        }

        this.setState({ isLoading: true });
        try {
            let res = await userService.postVerifyResetPassword({
                token: this.state.token,
                newPassword: this.state.newPassword
            });

            if (res && res.errCode === 0) {
                toast.success("Đặt lại mật khẩu thành công!");
                this.props.history.push('/login');
            } else {
                toast.error(res.message ? res.message : "Có lỗi xảy ra!");
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra khi đặt lại mật khẩu!");
        }
        this.setState({ isLoading: false });
    }

    render() {
        let { newPassword } = this.state;
        return (
            <div className="forgot-password-background">
                <div className="forgot-password-container">
                    <div className="forgot-password-content">
                        <div className="col-12 text-center title">Đặt Lại Mật Khẩu</div>
                        <div className="col-12 form-group">
                            <label>Nhập mật khẩu mới:</label>
                            <input type="password" className="form-control"
                                placeholder="Mật khẩu mới..."
                                value={newPassword}
                                onChange={(event) => this.handleOnChangeInput(event)}
                            />
                        </div>
                        <div className="col-12 text-center">
                            <button
                                className="btn-send-email"
                                onClick={() => this.handleReset()}
                                disabled={this.state.isLoading}
                            >
                                {this.state.isLoading && <i className="fas fa-spinner fa-spin"></i>}
                                {this.state.isLoading ? 'Đang gửi...' : 'Xác nhận'}
                            </button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));
