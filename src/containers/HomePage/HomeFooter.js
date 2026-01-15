import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './HomeFooter.scss';

class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer-container">
                <div className="custom-container">
                    <div className="footer-content">

                        <div className="footer-column">
                            <h3 className="footer-title">
                                <FormattedMessage id="footer.hospital_name" />
                            </h3>
                            <ul>
                                <li><FormattedMessage id="footer.work_schedule" /></li>
                                <li><FormattedMessage id="footer.morning" /></li>
                                <li><FormattedMessage id="footer.afternoon" /></li>
                                <li><FormattedMessage id="footer.address" /></li>
                                <li><FormattedMessage id="footer.phone" /></li>
                                <li><FormattedMessage id="footer.customer_care" /></li>
                                <li><FormattedMessage id="footer.email_sales" /></li>
                                <li><FormattedMessage id="footer.email_hr" /></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">
                                <FormattedMessage id="footer.regulation" />
                            </h3>
                            <ul>
                                <li><a href="#"><FormattedMessage id="footer.intro" /></a></li>
                                <li><a href="#"><FormattedMessage id="footer.leadership" /></a></li>
                                <li><a href="#"><FormattedMessage id="footer.process" /></a></li>
                                <li><a href="#"><FormattedMessage id="footer.hr_org" /></a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">
                                <FormattedMessage id="footer.map" />
                            </h3>
                            <div className="map-container">
                                <iframe
                                    src="https://maps.google.com/maps?q=B%E1%BB%87nh%20vi%E1%BB%87n%20%C4%90a%20khoa%20B%C3%ACnh%20D%C3%A2n%20%C4%90%C3%A0%20N%E1%BA%B5ng%20376%20Tr%E1%BA%A7n%20Cao%20V%C3%A2n&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="160"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Hospital Map"
                                ></iframe>
                            </div>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">
                                <FormattedMessage id="footer.hospital_name" />
                            </h3>
                            <ul>
                                <li><a href="#"><FormattedMessage id="footer.guideline" /></a></li>
                                <li><a href="#"><FormattedMessage id="footer.health_check" /></a></li>
                                <li><a href="#"><FormattedMessage id="footer.product" /></a></li>
                                <li><a href="#"><FormattedMessage id="footer.nguu_giac_linh" /></a></li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(HomeFooter);