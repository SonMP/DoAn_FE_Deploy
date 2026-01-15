import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';

import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
import Register from './Auth/Register';
import Login from '../containers/Auth/Login';
import HomeLayout from './HomePage/HomeLayout';
import System from '../routes/System';
import Doctor from '../routes/Doctor';
import HomePage from './HomePage/HomePage';
import VerifyEmail from './Patient/VerifyEmail';
import AllDoctors from './Patient/Doctor/AllDoctors';
import AllSpecialty from './Patient/Speicalty/AllSpecialty';
import DetailSpecialty from './Patient/Speicalty/DetailSpecialty';
import PatientOwnHistory from './Patient/PatientOwnHistory';
import SearchBooking from './Patient/SearchBooking';
import DetailDoctor from '../containers/Patient/Doctor/DetailDoctor';
import ConfirmModal from '../components/ConfirmModal';
import Chatbot from './HomePage/Chatbot';
import './App.scss';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />

                        <span className="content-container">
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                                <Route path={path.REGISTER} component={userIsNotAuthenticated((Register))} />
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />

                                <Route path={[path.HOMEPAGE, path.DETAIL_DOCTOR, path.LIST_DOCTOR, path.DETAIL_SPECIALTY, path.LIST_SPECIALTY, path.PATIENT, path.SEARCH_BOOKING]} exact>
                                    <HomeLayout>
                                        <Switch>
                                            <Route path={path.HOMEPAGE} exact component={HomePage} />
                                            <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                            <Route path={path.LIST_DOCTOR} component={AllDoctors} />
                                            <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                            <Route path={path.LIST_SPECIALTY} component={AllSpecialty} />
                                            <Route path={path.PATIENT} component={userIsAuthenticated(PatientOwnHistory)} />
                                            <Route path={path.SEARCH_BOOKING} component={SearchBooking} />
                                        </Switch>
                                    </HomeLayout>
                                </Route>
                                <Route path={path.DOCTOR} component={userIsAuthenticated(Doctor)} />
                                <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                            </Switch>
                        </span>

                    </div>
                    <Chatbot />
                </Router>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);