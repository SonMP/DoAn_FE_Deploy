import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import AdminDashboard from '../containers/System/Admin/AdminDashboard';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;

        if (isLoggedIn && userInfo && userInfo.maVaiTro === 'R3') {
            return <Redirect to="/trangchu" />
        }

        if (isLoggedIn && userInfo && userInfo.maVaiTro === 'R2') {
            return <Redirect to="/doctor/manage-profile" />
        }
        return (
            <>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/manage-user" component={UserRedux} />
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/admin-dashboard" component={AdminDashboard} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
