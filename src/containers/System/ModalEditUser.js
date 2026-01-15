import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
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
        let hasUserChanged = prevProps.currentUser !== this.props.currentUser;
        let hasModalOpened = prevProps.isOpen === false && this.props.isOpen === true;

        if ((hasUserChanged || hasModalOpened) && this.props.currentUser) {

            let user = this.props.currentUser;

            this.setState({
                id: user.id,
                email: user.email,
                matKhau: user.matKhau || '123456',
                ten: user.ten,
                ho: user.ho,
                diaChi: user.diaChi
            });
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

    handleEditUser = async () => {
        try {
            let user = this.state;
            await this.props.editUser(user);
        } catch (e) {
            console.log(e)
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
                    <ModalHeader toggle={() => this.toggle()} > Cập nhật người dùng</ModalHeader>
                    <ModalBody>
                        <div className="modal-user-body">
                            <div className="input-container">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name='email'
                                    value={this.state.email}
                                    placeholder=""
                                    disabled
                                />
                            </div>
                            <div className="input-container">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name='matKhau'
                                    value={this.state.matKhau}
                                    placeholder=""
                                    disabled
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
                                    placeholder=""
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
                                    placeholder=""
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
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter Footer>
                        <Button color="primary" className='px-3' onClick={() => this.handleEditUser()}>Lưu thay đổi</Button>{''}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
