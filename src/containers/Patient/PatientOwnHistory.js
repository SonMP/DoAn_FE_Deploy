import React, { Component } from 'react';
import { connect } from "react-redux";
import { userService } from '../../../src/services';
import PatientHistory from './Doctor/PatientHistory';

class PatientOwnHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            historyData: []
        }
    }

    async componentDidMount() {
        let { userInfo } = this.props;

        if (userInfo && userInfo.id) {

            let res = await userService.getPatientHistory(userInfo.id);
            if (res && res.errCode === 0) {
                this.setState({
                    historyData: res.data
                })
            }
        }
    }

    render() {
        return (
            <div className="patient-own-history-container">
                <div className="container">
                    <PatientHistory historyData={this.state.historyData} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
    };
};

export default connect(mapStateToProps)(PatientOwnHistory);