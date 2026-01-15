import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

class HomeLayout extends Component {
    render() {
        return (
            <div className="home-layout-container">
                <HomeHeader />

                <div className="main-content">
                    {this.props.children}
                </div>

                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

export default connect(mapStateToProps)(HomeLayout);