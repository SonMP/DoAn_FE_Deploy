import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            matKhau: '',
            ten: '',
            ho: '',
            diaChi: ''
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
            this.setState({
                email: '',
                matKhau: '',
                ten: '',
                ho: '',
                diaChi: ''
            })
        }
    }

    toggle = () => {
        this.props.toggleFormParent();
    }


    handleOnChangInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrState = ['email', 'matKhau', 'ten', 'ho', 'diaChi'];
        for (let i = 0; i < arrState.length; i++) {
            if (!this.state[arrState[i]]) {
                isValid = false;
                alert('Thiếu thông tin: ' + arrState[i]);
                break;
            }
        }
        return isValid;
    }
    handleAddNewUser = () => {
        let check = this.checkValidateInput();
        if (check === true) {
            this.props.createNewUser(this.state);
        }
    }

    render() {
        return (
            <>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => this.toggle()}
                    className={'modal-user-container'}
                    size='lg'
                >
                    <ModalHeader toggle={() => this.toggle()} > Tạo người dùng</ModalHeader>
                    <ModalBody>
                        <div className="modal-user-body">
                            <div className="input-container">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name='email'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangInput(event)}
                                    placeholder="Nhập email..."
                                />
                            </div>
                            <div className="input-container">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name='matKhau'
                                    value={this.state.matKhau}
                                    onChange={(event) => this.handleOnChangInput(event)}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                            <div className="input-container">
                                <label>Tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name='ten'
                                    value={this.state.ten}
                                    onChange={(event) => this.handleOnChangInput(event)}
                                    placeholder="Nhập tên người dùng"
                                />
                            </div>
                            <div className="input-container">
                                <label>Họ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name='ho'
                                    value={this.state.ho}
                                    onChange={(event) => this.handleOnChangInput(event)}
                                    placeholder="Nhập họ người dùng"
                                />
                            </div>
                            <div className="input-container max-width-input">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name='diaChi'
                                    value={this.state.diaChi}
                                    onChange={(event) => this.handleOnChangInput(event)}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                        </div>
                    </ModalBody>


                    <ModalFooter Footer>
                        <Button color="primary" className='px-3' onClick={() => this.handleAddNewUser()}>Thêm người dùng</Button>{''}
                        <Button color="secondary" className='px-3' onClick={() => this.toggle()}>Đóng</Button>
                    </ModalFooter>
                </Modal >
            </>

        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
