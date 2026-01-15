import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils, MANAGE_ACTIONS } from "../../../utils";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { toast } from "react-toastify";
import * as actions from "../../../store/actions";

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            matKhau: '',
            ten: '',
            ho: '',
            soDienThoai: '',
            diaChi: '',
            gioiTinh: '',
            maViTri: '',
            maVaiTro: '',
            hinhAnh: '',
            previewImgURL: '',

            isOpenLightbox: false,
        }
    }

    componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
            let { genderRedux, roleRedux, positionRedux } = this.props;

            if (this.props.action === MANAGE_ACTIONS.EDIT) {
                let user = this.props.userEdit;
                let imageBase64 = user.hinhAnh ? user.hinhAnh : '';

                this.setState({
                    email: user.email,
                    matKhau: 'placeholder',
                    ten: user.ten,
                    ho: user.ho,
                    soDienThoai: user.soDienThoai,
                    diaChi: user.diaChi,
                    gioiTinh: user.gioiTinh,
                    maVaiTro: user.maVaiTro,
                    maViTri: user.maViTri,
                    hinhAnh: user.hinhAnh,
                    previewImgURL: imageBase64,
                })
            }
            else {
                this.setState({
                    email: '',
                    matKhau: '',
                    ten: '',
                    ho: '',
                    soDienThoai: '',
                    diaChi: '',
                    gioiTinh: genderRedux && genderRedux.length > 0 ? genderRedux[0].khoa : '',
                    maViTri: positionRedux && positionRedux.length > 0 ? positionRedux[0].khoa : '',
                    maVaiTro: roleRedux && roleRedux.length > 0 ? roleRedux[0].khoa : '',
                    hinhAnh: '',
                    previewImgURL: '',
                })
            }
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        if (id === 'maVaiTro' && event.target.value === 'R3') {
            copyState['maViTri'] = '';
        }
        this.setState({ ...copyState });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            try {
                let base64 = await CommonUtils.getBase64Resized(file);
                let objectUrl = URL.createObjectURL(file);
                this.setState({
                    previewImgURL: objectUrl,
                    hinhAnh: base64
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    checkValidateInput = () => {
        if (this.props.action === MANAGE_ACTIONS.CREATE) {

            let arrCheck = ['email', 'matKhau', 'ten', 'ho', 'diaChi', 'soDienThoai', 'maVaiTro'];

            for (let i = 0; i < arrCheck.length; i++) {
                if (!this.state[arrCheck[i]]) {
                    toast.error('Vui lòng nhập đầy đủ thông tin: ' + arrCheck[i]);
                    return false;
                }
            }

            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.state.email)) {
                toast.error('Email không hợp lệ! (Ví dụ: abc@gmail.com)');
                return false;
            }

            if (this.state.matKhau.length < 6) {
                toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
                return false;
            }

        }
        return true;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { action } = this.props;
        this.props.handleSaveUserFromParent({
            id: this.props.userEdit.id,
            action: action,
            userData: this.state
        });
    }

    render() {
        let { genderRedux, roleRedux, positionRedux, isLoadingGender, language } = this.props;
        let { email, matKhau, ten, ho, soDienThoai, diaChi, gioiTinh, maViTri, maVaiTro } = this.state;
        let isEdit = this.props.action === MANAGE_ACTIONS.EDIT;

        return (
            <>
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggleFromParent} className={'modal-user-container'} size="lg" centered style={{ maxWidth: '1000px', width: '90%' }}>
                    <ModalHeader toggle={this.props.toggleFromParent}>
                        {isEdit ? "Cập nhật thông tin người dùng" : "Thêm mới người dùng"}
                    </ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center mb-3">
                                    {isLoadingGender && <div>Đang tải dữ liệu...</div>}
                                </div>

                                <div className="col-6 form-group">
                                    <label>Email</label>
                                    <input className="form-control" type="email" value={email}
                                        onChange={(e) => this.onChangeInput(e, 'email')}
                                        disabled={isEdit}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Mật khẩu</label>
                                    <input className="form-control" type="password" value={matKhau}
                                        onChange={(e) => this.onChangeInput(e, 'matKhau')}
                                        disabled={isEdit}
                                        placeholder={isEdit ? "Không thể đổi mật khẩu tại đây" : ""}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Tên</label>
                                    <input className="form-control" type="text" value={ten}
                                        onChange={(e) => this.onChangeInput(e, 'ten')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Họ</label>
                                    <input className="form-control" type="text" value={ho}
                                        onChange={(e) => this.onChangeInput(e, 'ho')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Địa chỉ</label>
                                    <input className="form-control" type="text" value={diaChi}
                                        onChange={(e) => this.onChangeInput(e, 'diaChi')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Số điện thoại</label>
                                    <input className="form-control" type="text" value={soDienThoai}
                                        onChange={(e) => this.onChangeInput(e, 'soDienThoai')} />
                                </div>
                                <div className="col-3 form-group">
                                    <label>Giới tính</label>
                                    <select className="form-control" onChange={(e) => this.onChangeInput(e, 'gioiTinh')} value={gioiTinh}>
                                        {genderRedux && genderRedux.map((item, index) => {
                                            return <option key={index} value={item.khoa}>{language === 'vi' ? item.giaTriVi : item.giaTriEn}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-3 form-group">
                                    <label>Vai trò</label>
                                    <select className="form-control" onChange={(e) => this.onChangeInput(e, 'maVaiTro')} value={maVaiTro}>
                                        {roleRedux && roleRedux.map((item, index) => {
                                            return <option key={index} value={item.khoa}>{language === 'vi' ? item.giaTriVi : item.giaTriEn}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-3 form-group">
                                    <label>Chức danh</label>
                                    <select className="form-control" onChange={(e) => this.onChangeInput(e, 'maViTri')} value={maViTri} disabled={maVaiTro === 'R3'}>
                                        {positionRedux && positionRedux.map((item, index) => {
                                            return <option key={index} value={item.khoa}>{language === 'vi' ? item.giaTriVi : item.giaTriEn}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-3 form-group">
                                    <label>Hình ảnh</label>
                                    <div className="preview-img-container">
                                        <input id="previewImg" type="file" hidden onChange={(e) => this.handleOnChangeImage(e)} />
                                        <label className="label-upload" htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i></label>
                                        <div className="preview-image"
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={() => this.setState({ isOpenLightbox: true })}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSaveUser()}>
                            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>{' '}
                        <Button color="secondary" onClick={this.props.toggleFromParent}>Hủy</Button>
                    </ModalFooter>
                </Modal>

                {this.state.isOpenLightbox &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpenLightbox: false })}
                    />
                }
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);