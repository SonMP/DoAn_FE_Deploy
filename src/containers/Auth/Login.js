import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { userService } from '../../services';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            rememberMe: false,
            errMessage: ''
        }
    }

    componentDidMount() {
        let rememberEmail = localStorage.getItem('rememberEmail');
        if (rememberEmail) {
            this.setState({
                username: rememberEmail,
                rememberMe: true
            });
        }
    }

    handleOnChangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value,
            errMessage: ''
        })
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    handleOnChangeRemember = () => {
        this.setState({
            rememberMe: !this.state.rememberMe
        })
    }

    handleLogin = async () => {
        this.setState({ errMessage: '' });
        try {
            let data = await userService.handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })

            } else {

                if (this.state.rememberMe) {
                    localStorage.setItem('rememberEmail', this.state.username);
                } else {
                    localStorage.removeItem('rememberEmail');
                }

                this.props.userLoginSuccess(data.user, data.token);
                if (data.user.maVaiTro === 'R3') {
                    if (this.props.history) {
                        this.props.history.replace('/trangchu');
                    }
                }
            }

        } catch (error) {
            this.setState({
                errMessage: error
            })
        }

    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    }

    handleGoToRegister = () => {
        this.props.navigate('/register');
    }

    render() {
        const { username, password, isShowPassword, errMessage, rememberMe } = this.state;

        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-brand-col'>
                        <div className='brand-content'>
                            <div className='icon-logo'>
                                <i className="fas fa-heartbeat"></i>
                            </div>
                            <h2>BỆNH VIỆN BÌNH DÂN</h2>
                            <p className='sub-text'>Hệ thống Quản lý Đặt lịch & Tư vấn AI</p>
                            <div className='line-deco'></div>
                            <p className='desc'>
                                Nền tảng y tế số hóa, hỗ trợ kết nối Bác sĩ và Bệnh nhân nhanh chóng, tiện lợi và bảo mật.
                            </p>
                        </div>
                        <div className='footer-brand'>
                            &copy; 2025 Binh Dan Hospital Da Nang
                        </div>
                    </div>

                    <div className='login-form-col'>
                        <div className='form-wrapper'>
                            <h3 className='form-title'>Đăng nhập hệ thống</h3>
                            <p className='form-subtitle'>Hãy đăng nhập để tiếp tục</p>

                            <div className='input-group-custom'>
                                <label>Tài khoản</label>
                                <div className='input-wrapper'>
                                    <input
                                        type='text'
                                        placeholder='Nhập tên đăng nhập...'
                                        value={username}
                                        onChange={(event) => this.handleOnChangeInput(event, 'username')}
                                        className={errMessage ? 'error-border' : ''}
                                    />
                                    <i className="far fa-user input-icon"></i>
                                </div>
                            </div>

                            <div className='input-group-custom'>
                                <label>Mật khẩu</label>
                                <div className='input-wrapper'>
                                    <input
                                        type={isShowPassword ? 'text' : 'password'}
                                        placeholder='Nhập mật khẩu...'
                                        value={password}
                                        onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                        onKeyDown={(event) => this.handleKeyDown(event)}
                                        className={errMessage ? 'error-border' : ''}
                                    />
                                    <i className="fas fa-lock input-icon"></i>
                                    <span
                                        className='show-pass-btn'
                                        onClick={() => this.handleShowHidePassword()}
                                    >
                                        <i className={isShowPassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                                    </span>
                                </div>
                            </div>

                            <div className='error-text'>
                                {errMessage}
                            </div>

                            <div className='actions'>
                                <div className='remember-me'>
                                    <input
                                        type="checkbox"
                                        id="rememberMeCheckbox"
                                        checked={rememberMe}
                                        onChange={() => this.handleOnChangeRemember()}
                                    />
                                    <label htmlFor="rememberMeCheckbox">Ghi nhớ đăng nhập</label>
                                </div>
                                <span className='forgot-pass' onClick={() => { this.props.history.push('/forgot-password') }}>Quên mật khẩu?</span>
                            </div>

                            <button
                                className='btn-login-system'
                                onClick={() => this.handleLogin()}
                            >
                                Truy cập ngay <i className="fas fa-arrow-right"></i>
                            </button>

                            <div className='register-section'>
                                <span className='text-guide'>Bạn chưa có tài khoản khám bệnh?</span>
                                <span
                                    className='link-register'
                                    onClick={() => this.handleGoToRegister()}
                                >
                                    Đăng ký miễn phí ngay
                                </span>
                            </div>
                            <div className='internal-note'>
                                * Bác sĩ & NV Y tế vui lòng liên hệ Quản trị viên để cấp tài khoản.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo, token) => dispatch(actions.userLoginSuccess(userInfo, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);