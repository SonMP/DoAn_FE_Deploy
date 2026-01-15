import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import HomeContent from './HomeContent';
import Specialty from './Session/Specialty';
import Doctor from './Session/Doctor';
import Service from './Session/Service';
import Feedback from './Session/Feedback';
import HomeFooter from './HomeFooter';

class HomePage extends Component {

    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: { slidesToShow: 3 }
                },
                {
                    breakpoint: 768,
                    settings: { slidesToShow: 2 }
                },
                {
                    breakpoint: 480,
                    settings: { slidesToShow: 1 }
                }
            ]
        };
        return (
            <>
                <div>
                    <HomeContent />
                    <Specialty settings={settings} />
                    <Doctor settings={settings} />
                    <Service />
                    <Feedback />
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);