import React, { Component } from 'react';
import { connect } from "react-redux";
import './PatientHistory.scss';
import moment from 'moment';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class PatientHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenLightbox: false,
            previewImgURL: ''
        }
    }

    openPreviewImage = (image) => {
        if (!image) return;
        this.setState({
            isOpenLightbox: true,
            previewImgURL: image
        })
    }

    render() {
        let { historyData } = this.props;
        let { isOpenLightbox, previewImgURL } = this.state;

        return (
            <div className="patient-history-container">
                <div className="history-header">
                    <h2 className="title">Lịch sử khám bệnh</h2>
                    <p className="subtitle">Hồ sơ sức khỏe điện tử</p>
                </div>

                <div className="history-body">
                    {historyData && historyData.length > 0 ? (
                        <div className="timeline">
                            {historyData.map((item, index) => {
                                let date = moment(item.createdAt).format('DD/MM/YYYY');
                                let time = moment(item.createdAt).format('HH:mm');
                                return (
                                    <div className="timeline-item" key={index}>
                                        <div className="timeline-date">
                                            <span className="date">{date}</span>
                                            <span className="time">{time}</span>
                                        </div>

                                        <div className="timeline-marker"></div>

                                        <div className='timeline-content'>
                                            <div className="doctor-info">
                                                <div className="doctor-avatar">
                                                    <i className="fas fa-user-md"></i>
                                                </div>
                                                <div className="doctor-name">
                                                    {item.bacSiData ?
                                                        `BS. ${item.bacSiData.ho} ${item.bacSiData.ten}`
                                                        : 'Bác sĩ'
                                                    }
                                                </div>
                                            </div>

                                            <div className="diagnosis-section">
                                                <label>Chẩn đoán & Lời dặn:</label>
                                                <p className="diagnosis-text">
                                                    {item.moTa ? item.moTa : <i>Không có ghi chú</i>}
                                                </p>
                                            </div>

                                            {item.taiLieu &&
                                                <div className="prescription-section">
                                                    <label>Đơn thuốc / Hóa đơn:</label>
                                                    <div className="prescription-image"
                                                        onClick={() => this.openPreviewImage(item.taiLieu)}
                                                        style={{ backgroundImage: `url(${item.taiLieu})` }}
                                                    >
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="no-data" style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                            <i className="fas fa-clipboard-list" style={{ fontSize: '40px', marginBottom: '10px', display: 'block' }}></i>
                            <span>Bệnh nhân chưa có lịch sử khám bệnh nào.</span>
                        </div>
                    )}
                </div>

                {isOpenLightbox && (
                    <Lightbox
                        mainSrc={previewImgURL}
                        onCloseRequest={() => this.setState({ isOpenLightbox: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(PatientHistory);