import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../../utils';
import './RemedyModal.scss';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            note: ''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    handleOnChangeNote = (event) => {
        this.setState({ note: event.target.value });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, isShowLoading } = this.props;

        return (
            <Modal

                isOpen={isOpenModal}
                backdrop={isShowLoading ? "static" : true}
                keyboard={!isShowLoading}
                toggle={closeRemedyModal}
                className={'remedy-modal-container'}
                size="md"
                centered
            >
                <div className="remedy-modal-content">

                    <div className="remedy-modal-header">
                        <span className="left">Gửi hóa đơn khám bệnh</span>
                        <span className="right" onClick={closeRemedyModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>

                    {/* 2. LOADING OVERLAY - Giống hệt BookingModal */}
                    {isShowLoading === true &&
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <div className="text">Đang gửi mail...</div>
                        </div>
                    }

                    {/* 3. BODY */}
                    <div className="remedy-modal-body">
                        <div className="row">
                            <div className="col-12 form-group">
                                <label>Email bệnh nhân</label>
                                <input className="form-control" type="email" value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)}
                                />
                            </div>

                            <div className="col-12 form-group">
                                <label>Chọn file hóa đơn/đơn thuốc</label>
                                <div className="custom-file-input">
                                    <input id="previewImg" type="file" hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className="label-upload" htmlFor="previewImg">
                                        Tải ảnh lên <i className="fas fa-upload"></i>
                                    </label>
                                    {/* Preview ảnh nhỏ nếu có */}
                                    <div className="preview-image"
                                        style={{ backgroundImage: `url(${this.state.imgBase64})` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="col-12 form-group">
                                <label>Lời dặn của bác sĩ</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={this.state.note}
                                    onChange={(event) => this.handleOnChangeNote(event)}
                                    placeholder="Hướng dẫn sử dụng thuốc, lịch tái khám..."
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>

                    {/* 4. FOOTER */}
                    <div className="remedy-modal-footer">
                        <button className="btn-remedy-confirm" onClick={() => this.handleSendRemedy()} disabled={isShowLoading}>
                            Gửi hóa đơn
                        </button>
                        <button className="btn-remedy-cancel" onClick={closeRemedyModal} disabled={isShowLoading}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

export default connect(mapStateToProps)(RemedyModal);