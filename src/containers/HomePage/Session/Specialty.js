import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import { specialtyService } from '../../../services';
import { withRouter } from 'react-router';

class Specialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await specialtyService.getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    handleLoadMore = () => {
        this.props.history.push('/all-specialty');
    }

    render() {
        let { settings } = this.props;
        let { dataSpecialty } = this.state;

        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="section.specialty_title" defaultMessage="Chuyên khoa phổ biến" />
                        </span>
                        <button className="btn-section" onClick={() => this.handleLoadMore()}>
                            <FormattedMessage id="section.view_all" defaultMessage="Xem thêm" />
                        </button>
                    </div>

                    <div className="section-body">
                        <Slider {...settings}>
                            {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div className="section-customize" key={index} onClick={() => this.handleViewDetailSpecialty(item)} style={{ cursor: 'pointer' }}>
                                            <div className="specialty-card-modern">
                                                <div className="bg-image section-specialty-bg"
                                                    style={{ backgroundImage: `url(${item.hinhAnh})` }}
                                                >
                                                </div>
                                                <div className="overlay">
                                                    <div className="specialty-name">{item.ten}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));