import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {

    render() {
        const { isLoggedIn, userInfo } = this.props;

        let linkToRedirect = '/trangchu';
        if (isLoggedIn && userInfo) {
            let role = userInfo.maVaiTro;
            if (role === 'R1') {
                linkToRedirect = '/system/manage-user';
            }
            else if (role === 'R2') {
                linkToRedirect = '/doctor/manage-profile';
            }
            else {
                linkToRedirect = '/trangchu';
            }
        }

        return (
            <Redirect to={linkToRedirect} />
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
