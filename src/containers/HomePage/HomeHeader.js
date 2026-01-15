import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/images/logo-benhvien.png';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import * as actions from "../../store/actions";

class header extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/trangchu');
        }
    }

    handleLogin = () => {
        if (this.props.history) {
            this.props.history.push('/login');
        }
    }

    handleRegister = () => {
        if (this.props.history) {
            this.props.history.push('/register');
        }
    }

    handleLogout = () => {
        this.props.processLogout();
        if (this.props.history) {
            this.props.history.push('/trangchu');
        }
    }

    handleLoadAllDoctors = () => {
        if (this.props.history) {
            this.props.history.push('/all-doctors');
        }
    }

    handleLoadAllSpecialty = () => {
        if (this.props.history) {
            this.props.history.push('/all-specialty');
        }
    }
    handleSearchBooking = () => {
        if (this.props.history) {
            this.props.history.push('/search-booking');
        }
    }
    render() {
        let language = this.props.language;
        const { isLoggedIn, userInfo } = this.props;
        return (
            <React.Fragment>
                <div className="home-header-container">

                    <div className="home-header-top-bar">
                        <div className="custom-container">
                            <div className="top-left">
                                <i className="fas fa-phone-alt"></i>
                                <span><FormattedMessage id="header.hotline" /> </span>
                                <span className="hotline-number">0236.7105.888</span>
                            </div>

                            <div className="top-right">
                                <span className="item">
                                    <i className="far fa-clock"></i> <FormattedMessage id="header.opening_hours" />
                                </span>

                                <div className="item language">
                                    <span
                                        className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}
                                        onClick={() => this.changeLanguage(LANGUAGES.VI)}
                                    >
                                        VN
                                    </span>
                                    <span className="divider">|</span>
                                    <span
                                        className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}
                                        onClick={() => this.changeLanguage(LANGUAGES.EN)}
                                    >
                                        EN
                                    </span>
                                </div>

                                <div className="item login-section">
                                    {isLoggedIn && userInfo ? (
                                        <div className="user-info-container">
                                            <span className="welcome-msg">
                                                <FormattedMessage id="header.welcome" />, {userInfo.ten ? userInfo.ten : ''} !
                                            </span>
                                            {userInfo && (userInfo.maVaiTro === 'R1' || userInfo.maVaiTro === 'R2') &&
                                                <span
                                                    className="btn-system"
                                                    onClick={() => this.props.history.push('/system')}
                                                    style={{ margin: '0 10px', cursor: 'pointer', color: '#ffc107' }}
                                                    title="Vào trang quản lý"
                                                >
                                                    <i className="fas fa-tasks"></i> <FormattedMessage id="header.manage" />
                                                </span>
                                            }

                                            {userInfo && userInfo.maVaiTro === 'R3' &&
                                                <span
                                                    className="btn-history"
                                                    onClick={() => {
                                                        if (this.props.history) {
                                                            this.props.history.push('/patient/history');
                                                        }
                                                    }}
                                                    style={{ margin: '0 10px', cursor: 'pointer', color: ' #ffc107', fontWeight: 'bold' }}
                                                    title="Xem lịch sử khám bệnh"
                                                >
                                                    <i className="fas fa-history"></i> Lịch sử khám
                                                </span>
                                            }
                                            <span className="divider" style={{ margin: '0 5px' }}>|</span>
                                            <span
                                                className="btn-logout"
                                                onClick={() => this.handleLogout()}
                                                title={<FormattedMessage id="header.logout" />}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="fas fa-sign-out-alt"></i>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="auth-actions">
                                            <span
                                                onClick={() => this.handleLogin()}
                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                            >
                                                <FormattedMessage id="header.login" />
                                            </span>

                                            <span className="divider"> | </span>

                                            <span
                                                onClick={() => this.handleRegister()}
                                                style={{ cursor: 'pointer', marginRight: '5px' }}
                                            >
                                                <FormattedMessage id="header.register" />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="home-header-content">
                        <div className="custom-container main-content-wrapper">
                            <div className="left-content">
                                <div className="menu-icon d-block d-lg-none">
                                    <i className="fas fa-bars"></i>
                                </div>

                                <div className="header-logo"
                                    onClick={() => this.returnToHome()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={logo} alt="Logo BV Binh Dan" className="header-logo" />
                                </div>
                            </div>

                            <div className="center-content">
                                <div className="header-nav-item">
                                    <div className="icon-box"><i className="fas fa-info-circle"></i></div>
                                    <div className="text-box">
                                        <span className="main-text"><FormattedMessage id="header.about" /></span>
                                        <span className="sub-text"><FormattedMessage id="header.about_sub" /></span>
                                    </div>
                                </div>

                                <div className="header-nav-item"
                                    onClick={() => this.handleLoadAllSpecialty()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="icon-box"><i className="fas fa-hospital-user"></i></div>
                                    <div className="text-box">
                                        <span className="main-text"><FormattedMessage id="header.specialty" /></span>
                                        <span className="sub-text"><FormattedMessage id="header.search_doctor" /></span>
                                    </div>
                                </div>

                                <div className="header-nav-item"
                                    onClick={() => this.handleSearchBooking()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="icon-box">
                                        <i className="fas fa-calendar-alt"></i>
                                    </div>
                                    <div className="text-box">
                                        <span className="main-text"><FormattedMessage id="header.search_booking" /></span>
                                        <span className="sub-text"><FormattedMessage id="header.manage_booking" /></span>
                                    </div>
                                </div>

                                <div className="header-nav-item"
                                    onClick={() => this.handleLoadAllDoctors()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="icon-box"><i className="fas fa-user-md"></i></div>
                                    <div className="text-box" >
                                        <span className="main-text"><FormattedMessage id="header.doctor" /></span>
                                        <span className="sub-text"><FormattedMessage id="header.select_doctor" /></span>
                                    </div>
                                </div>

                                <div className="header-nav-item">
                                    <div className="icon-box"><i className="fas fa-file-medical-alt"></i></div>
                                    <div className="text-box">
                                        <span className="main-text"><FormattedMessage id="header.fee" /></span>
                                        <span className="sub-text"><FormattedMessage id="header.check_health" /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="right-content">
                                <div className="search-box">
                                    <i className="fas fa-search"></i>
                                </div>
                                <div className="support">
                                    <i className="fas fa-question-circle"></i>
                                    <span><FormattedMessage id="header.support" /></span>
                                </div>
                                <button className="btn-appointment" onClick={() => this.handleLoadAllDoctors()}>
                                    <i className="far fa-calendar-check"></i>
                                    <span><FormattedMessage id="header.booking" /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(header));