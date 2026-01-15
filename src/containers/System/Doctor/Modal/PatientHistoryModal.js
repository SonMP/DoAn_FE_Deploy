import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { userService } from '../../../../services';
import './PatientHistoryModal.scss';
import _ from 'lodash';
import moment from 'moment';

class PatientHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: '',
            fullChat: [],
            isLoading: false,
            isShowDetail: false
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.isOpen && this.props.isOpen !== prevProps.isOpen) {
            this.setState({ isLoading: true, summary: '', fullChat: [], isShowDetail: false });

            let res = await userService.getPatientChatSummary(this.props.patientId);
            if (res && res.errCode === 0) {
                this.setState({
                    summary: res.data.summary,
                    fullChat: res.data.fullChat,
                    isLoading: false
                });
            } else {
                this.setState({ isLoading: false, summary: 'Lỗi tải dữ liệu' });
            }
        }
    }

    toggleDetail = () => {
        this.setState({ isShowDetail: !this.state.isShowDetail });
    }

    render() {
        let { isOpen, toggle, patientName } = this.props;
        let { summary, fullChat, isLoading, isShowDetail } = this.state;

        return (
            <Modal isOpen={isOpen} toggle={toggle} className={'patient-history-modal-container'} size="lg">
                <ModalHeader toggle={toggle}>
                    Hồ sơ AI sơ bộ: {patientName}
                </ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <div className="text-center">Đang phân tích dữ liệu...</div>
                    ) : (
                        <div className="history-content">
                            <div className="ai-summary-box">
                                <h5><i className="fas fa-robot"></i> Đánh giá sơ bộ từ AI</h5>
                                <div className="summary-text">
                                    {summary}
                                </div>
                            </div>

                            <div className="chat-detail-section">
                                <div className="detail-toggle-btn" onClick={this.toggleDetail}>
                                    {isShowDetail ? 'Ẩn chi tiết hội thoại' : 'Xem chi tiết hội thoại gốc'}
                                    <i className={isShowDetail ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
                                </div>

                                {isShowDetail && (
                                    <div className="chat-log-container">
                                        {fullChat && fullChat.length > 0 ? fullChat.map((item, index) => {
                                            return (
                                                <div key={index} className={`chat-item ${item.sender === 'AI' ? 'bot' : 'user'}`}>
                                                    <div className="sender-name">{item.sender} - {moment(item.time).format('HH:mm DD/MM')}</div>
                                                    <div className="bubble">{item.text}</div>
                                                </div>
                                            )
                                        }) : (
                                            <div>Không có dữ liệu hội thoại.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Đóng</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default PatientHistoryModal;