import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Register.scss';
import { userService } from '../../services';
import { toast } from "react-toastify";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            matKhau: '',
            ten: '',
            ho: '',
            soDienThoai: '',
            diaChi: '',
            gioiTinh: '',

            genderArr: [],
            isShowPassword: false,
            errMessage: ''
        }
    }

    async componentDidMount() {
        try {
            let response = await userService.getQuyDinhService('GENDER');

            if (response && response.errCode === 0) {
                let arrGenders = response.data;
                this.setState({
                    genderArr: arrGenders,
                    gioiTinh: arrGenders && arrGenders.length > 0 ? arrGenders[0].khoa : ''
                })
            }
        } catch (e) {
            console.log(e);
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

    checkValidateInput = () => {

        let arrCheck = ['email', 'matKhau', 'ten', 'ho', 'soDienThoai', 'diaChi', 'gioiTinh'];

        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                this.setState({
                    errMessage: `Bạn đã điền thiếu thông tin: ${arrCheck[i]}`
                })
                toast.error('Vui lòng nhập đầy đủ thông tin: ' + arrCheck[i]);
                return false;
            }
        }

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.state.email)) {
            toast.error('Email không hợp lệ! (Ví dụ: abc@gmail.com)');
            return false;
        }

        if (this.state.matKhau.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return false;
        }


        return true;

    }

    handleRegister = async () => {
        this.setState({ errMessage: '' });

        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        try {
            let data = await userService.registerUserService({
                email: this.state.email,
                matKhau: this.state.matKhau,
                ten: this.state.ten,
                ho: this.state.ho,
                diaChi: this.state.diaChi,
                soDienThoai: this.state.soDienThoai,
                gioiTinh: this.state.gioiTinh,

                maVaiTro: 'R3'
            });

            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage
                })
                toast.error(data.errMessage)
            } else {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                this.props.navigate('/login');
            }

        } catch (error) {
            console.log(error);
            this.setState({
                errMessage: "Lỗi kết nối đến máy chủ"
            })
        }
    }

    handleGoToLogin = () => {
        this.props.navigate('/login');
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleRegister();
        }
    }

    render() {
        const { email, matKhau, ten, ho, soDienThoai, diaChi, gioitinh, genderArr, isShowPassword, errMessage } = this.state;
        let language = this.props.lang;

        return (
            <div className='register-background'>
                <div className='register-container'>
                    <div className='register-brand-col'>
                        <div className='brand-content'>
                            <div className='icon-logo'>
                                <i className="fas fa-hospital-user"></i>
                            </div>
                            <h2>BỆNH VIỆN BÌNH DÂN</h2>
                            <p className='sub-text'>Đăng ký tài khoản Bệnh nhân</p>
                            <div className='line-deco'></div>
                            <p className='desc'>
                                Tạo tài khoản ngay để đặt lịch khám trực tuyến.
                            </p>
                        </div>
                        <div className='footer-brand'>
                            &copy; 2025 Binh Dan Hospital Da Nang
                        </div>
                    </div>

                    <div className='register-form-col'>
                        <div className='form-wrapper'>
                            <h3 className='form-title'>Tạo tài khoản mới</h3>
                            <p className='form-subtitle'>Nhập thông tin cá nhân của bạn</p>

                            <div className='row-input'>
                                <div className='input-group-custom full-width'>
                                    <label>Email</label>
                                    <div className='input-wrapper'>
                                        <input
                                            type='email'
                                            placeholder='Nhập địa chỉ email...'
                                            value={email}
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                        />
                                        <i className="far fa-envelope input-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className='row-input'>
                                <div className='input-group-custom full-width'>
                                    <label>Mật khẩu</label>
                                    <div className='input-wrapper'>
                                        <input
                                            type={isShowPassword ? 'text' : 'password'}
                                            placeholder='Nhập mật khẩu...'
                                            value={matKhau}
                                            onChange={(event) => this.handleOnChangeInput(event, 'matKhau')}
                                        />
                                        <i className="fas fa-lock input-icon"></i>
                                        <span className='show-pass-btn' onClick={() => this.handleShowHidePassword()}>
                                            <i className={isShowPassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='row-input'>
                                <div className='input-group-custom half-width'>
                                    <label>Họ</label>
                                    <div className='input-wrapper'>
                                        <input
                                            type='text'
                                            placeholder='Họ'
                                            value={ho}
                                            onChange={(event) => this.handleOnChangeInput(event, 'ho')}
                                        />
                                        <i className="far fa-user input-icon"></i>
                                    </div>
                                </div>
                                <div className='input-group-custom half-width'>
                                    <label>Tên</label>
                                    <div className='input-wrapper'>
                                        <input
                                            type='text'
                                            placeholder='Tên'
                                            value={ten}
                                            onChange={(event) => this.handleOnChangeInput(event, 'ten')}
                                        />
                                        <i className="fas fa-user input-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className='row-input'>
                                <div className='input-group-custom half-width'>
                                    <label>Số điện thoại</label>
                                    <div className='input-wrapper'>
                                        <input
                                            type='text'
                                            placeholder='Số điện thoại'
                                            value={soDienThoai}
                                            onChange={(event) => this.handleOnChangeInput(event, 'soDienThoai')}
                                        />
                                        <i className="fas fa-phone input-icon"></i>
                                    </div>
                                </div>
                                <div className='input-group-custom half-width'>
                                    <label>Giới tính</label>
                                    <div className='input-wrapper'>
                                        <select
                                            className='custom-select'
                                            onChange={(event) => this.handleOnChangeInput(event, 'gioiTinh')}
                                            value={this.state.gioiTinh}
                                        >
                                            {genderArr && genderArr.length > 0 &&
                                                genderArr.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.khoa}>
                                                            {language === 'vi' ? item.giaTriVi : item.giaTriEn}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <i className="fas fa-venus-mars input-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className='row-input'>
                                <div className='input-group-custom full-width'>
                                    <label>Địa chỉ liên hệ</label>
                                    <div className='input-wrapper'>
                                        <input
                                            type='text'
                                            placeholder='Nhập địa chỉ của bạn...'
                                            value={diaChi}
                                            onChange={(event) => this.handleOnChangeInput(event, 'diaChi')}
                                            onKeyDown={(event) => this.handleKeyDown(event)}
                                        />
                                        <i className="fas fa-map-marker-alt input-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className='error-text'>
                                {errMessage}
                            </div>

                            <button
                                className='btn-register-system'
                                onClick={() => this.handleRegister()}
                            >
                                Đăng ký ngay
                            </button>

                            <div className='login-link-section'>
                                <span className='text-guide'>Bạn đã có tài khoản?</span>
                                <span
                                    className='link-login'
                                    onClick={() => this.handleGoToLogin()}
                                >
                                    Đăng nhập tại đây
                                </span>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);