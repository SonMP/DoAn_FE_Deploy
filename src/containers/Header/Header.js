import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from "../../utils";
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import logo from '../../assets/images/logo-benhvien.png';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
        }
    }

    componentDidMount() {
        let { userInfo } = this.props;
        this.setMenuByRole(userInfo);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.userInfo !== this.props.userInfo) {
            let { userInfo } = this.props;
            this.setMenuByRole(userInfo);
        }
    }

    setMenuByRole = (userInfo) => {
        let menu = [];

        if (userInfo && !_.isEmpty(userInfo)) {

            let role = userInfo.maVaiTro;

            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } else if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }

        this.setState({
            menuApp: menu
        });
    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/trangchu');
        }
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="header-container">
                <div className="header-brand"
                    onClick={() => this.returnToHome()}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="brand-logo"> <img src={logo} alt="Logo BV Binh Dan" className="header-logo" /></div>
                    <span className="brand-text">BD HOSPITAL</span>
                </div>

                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className="header-right-content">

                    <div className="user-badge">
                        <span className="welcome-msg">
                            <FormattedMessage id="header.welcome" />
                        </span>
                        <span className="user-name">
                            {userInfo && userInfo.ten ? userInfo.ten : 'Admin'}
                        </span>
                    </div>

                    <div className="language-switch">
                        <span
                            className={language === LANGUAGES.VI ? 'lang-item active' : 'lang-item'}
                            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
                        >
                            VN
                        </span>
                        <span
                            className={language === LANGUAGES.EN ? 'lang-item active' : 'lang-item'}
                            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
                        >
                            EN
                        </span>
                    </div>

                    <div className="btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-power-off"></i>
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));