import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageProfile.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { doctorService, userService } from '../../../services';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ManageProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            ten: '',
            ho: '',
            diaChi: '',
            soDienThoai: '',
            gioiTinh: '',
            maViTri: '',
            hinhAnh: '',

            moTa: '',
            noiDungHTML: '',
            noiDungMarkdown: '',
            donGia: '',

            previewImgURL: '',
            arrGenders: [],
            arrPositions: [],
            hasOldData: false
        }
    }

    async componentDidMount() {
        let resGender = await userService.getQuyDinhService('GENDER');
        let resPosition = await userService.getQuyDinhService('POSITION');
        let { userInfo } = this.props;

        let resDoctor = await userService.getDetailInforDoctor(userInfo.id);

        let arrGenders = [], arrPositions = [];
        if (resGender && resGender.errCode === 0) arrGenders = resGender.data;
        if (resPosition && resPosition.errCode === 0) arrPositions = resPosition.data;

        this.setState({
            arrGenders: arrGenders,
            arrPositions: arrPositions,
            id: userInfo.id,
            email: userInfo.email,
            ho: userInfo.ho,
            ten: userInfo.ten,
            previewImgURL: userInfo.hinhAnh ? userInfo.hinhAnh : ''
        });

        if (resDoctor && resDoctor.errCode === 0 && resDoctor.data && resDoctor.data.id) {
            let data = resDoctor.data;
            let info = data.thongTinChiTiet;

            this.setState({
                diaChi: data.diaChi || '',
                soDienThoai: data.soDienThoai || '',
                gioiTinh: data.gioiTinh || '',
                maViTri: data.maViTri || '',
                hinhAnh: data.hinhAnh || '',
                previewImgURL: data.hinhAnh || '',

                moTa: info ? info.moTa : '',
                noiDungMarkdown: info ? info.noiDungMarkdown : '',
                noiDungHTML: info ? info.noiDungHTML : '',
                donGia: info ? info.donGia : '',

                hasOldData: true
            })
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            noiDungMarkdown: text,
            noiDungHTML: html,
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                hinhAnh: base64
            })
        }
    }

    handleSaveInfo = async () => {
        let res = await doctorService.updateDoctorProfile({
            id: this.state.id,

            diaChi: this.state.diaChi,
            soDienThoai: this.state.soDienThoai,
            gioiTinh: this.state.gioiTinh,
            maViTri: this.state.maViTri,
            hinhAnh: this.state.hinhAnh,

            moTa: this.state.moTa,
            noiDungHTML: this.state.noiDungHTML,
            noiDungMarkdown: this.state.noiDungMarkdown,
            donGia: this.state.donGia,

            action: this.state.hasOldData ? 'EDIT' : 'CREATE'
        });

        if (res && res.errCode === 0) {
            toast.success("Cập nhật thông tin thành công!");
        } else {
            toast.error("Cập nhật thất bại!");
            console.log("Error save info:", res);
        }
    }

    render() {
        let { language } = this.props;
        let { arrGenders, arrPositions } = this.state;
        return (
            <div className="manage-profile-container">
                <div className="m-p-title">
                    <FormattedMessage id="menu.doctor.manage-info" defaultMessage="Quản lý thông tin cá nhân" />
                </div>

                <div className="container m-p-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="preview-img-container">
                                <input
                                    id="previewImg"
                                    type="file"
                                    hidden
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                                <label className="label-upload" htmlFor="previewImg">
                                    <div
                                        className="preview-image"
                                        style={{ backgroundImage: `url(${this.state.previewImgURL ? this.state.previewImgURL : ''})` }}
                                    >
                                        {!this.state.previewImgURL && <span>Ảnh đại diện</span>}
                                    </div>
                                    <div className="upload-text"><i className="fas fa-camera"></i> Tải ảnh mới</div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Email (Không thể sửa)</label>
                                    <input className="form-control" value={this.state.email} disabled />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Họ và tên (Không thể sửa)</label>
                                    <input className="form-control" value={`${this.state.ho} ${this.state.ten}`} disabled />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        className="form-control"
                                        value={this.state.soDienThoai}
                                        onChange={(event) => this.handleOnChangeInput(event, 'soDienThoai')}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Địa chỉ phòng khám</label>
                                    <input
                                        className="form-control"
                                        value={this.state.diaChi}
                                        onChange={(event) => this.handleOnChangeInput(event, 'diaChi')}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Giới tính</label>
                                    <select
                                        className="form-control"
                                        onChange={(event) => this.handleOnChangeInput(event, 'gioiTinh')}
                                        value={this.state.gioiTinh}
                                    >
                                        <option value="">-- Chọn giới tính --</option>
                                        {arrGenders && arrGenders.length > 0 &&
                                            arrGenders.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.khoa}>
                                                        {language === LANGUAGES.VI ? item.giaTriVi : item.giaTriEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Chức danh / Học vị</label>
                                    <select
                                        className="form-control"
                                        onChange={(event) => this.handleOnChangeInput(event, 'maViTri')}
                                        value={this.state.maViTri}
                                    >
                                        <option value="">-- Chọn chức danh --</option>
                                        {arrPositions && arrPositions.length > 0 &&
                                            arrPositions.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.khoa}>
                                                        {language === LANGUAGES.VI ? item.giaTriVi : item.giaTriEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Giới thiệu ngắn</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                onChange={(event) => this.handleOnChangeInput(event, 'moTa')}
                                value={this.state.moTa}
                                placeholder="Ví dụ: Bác sĩ chuyên khoa II, Trưởng khoa..."
                            >
                            </textarea>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <label>Bài viết giới thiệu chi tiết</label>
                            <MdEditor
                                style={{ height: '400px', marginTop: '10px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.noiDungMarkdown}
                            />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <button
                                className="btn btn-save"
                                onClick={() => this.handleSaveInfo()}
                            >
                                <i className="fas fa-save"></i> Lưu cập nhật
                            </button>
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfile);