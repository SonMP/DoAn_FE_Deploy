import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss';
import { CommonUtils } from '../../../utils';
import { specialtyService } from '../../../services';
import { toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Swal from 'sweetalert2';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            description: '',
            previewImgURL: '',
            action: 'CREATE',
            listSpecialties: []
        }
    }

    async componentDidMount() {
        this.fetchAllSpecialties();
    }

    fetchAllSpecialties = async () => {
        let res = await specialtyService.getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                listSpecialties: res.data ? res.data : []
            })
        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

            if (!validImageTypes.includes(file.type)) {
                toast.error('Lỗi: Bạn chỉ được phép chọn file ảnh (JPG, PNG, GIF)!');
                return;
            }
            try {
                let base64 = await CommonUtils.getBase64Resized(file);
                let objectUrl = URL.createObjectURL(file);
                this.setState({
                    previewImgURL: objectUrl,
                    imageBase64: base64
                })
            } catch (error) {
                console.log("Lỗi resize hình ảnh:", error);
                toast.error('File ảnh này bị lỗi hoặc không đọc được. Vui lòng chọn ảnh khác!');
            }
        }
    }

    handleSaveNewSpecialty = async () => {
        let { action, id, name, imageBase64, descriptionHTML, descriptionMarkdown, description } = this.state;

        if (!name) {
            toast.error("Vui lòng điền tên Chuyên khoa!");
            return;
        }

        let res;
        let dataPayload = {
            ten: name,
            description: description,
            descriptionHTML: descriptionHTML,
            descriptionMarkdown: descriptionMarkdown
        };
        if (imageBase64) {
            dataPayload.hinhAnh = imageBase64;
        }

        if (action === 'CREATE') {
            if (!imageBase64) {
                toast.error("Vui lòng chọn hình ảnh!");
                return;
            }
            res = await specialtyService.createSpecialty(dataPayload);
        } else {
            if (!id) return;
            dataPayload.id = id;
            res = await specialtyService.updateSpecialty(dataPayload);
        }

        if (res && res.errCode === 0) {
            toast.success(action === 'CREATE' ? "Tạo chuyên khoa thành công!" : "Cập nhật thành công!");
            this.handleReset();
            this.fetchAllSpecialties();
        } else {
            toast.error(res.errMessage);
        }
    }

    handleEditSpecialty = (specialty) => {
        this.setState({
            id: specialty.id,
            name: specialty.ten,
            previewImgURL: specialty.hinhAnh,
            imageBase64: '',

            description: specialty.moTa ? specialty.moTa : '',
            descriptionHTML: specialty.noiDungHTML,
            descriptionMarkdown: specialty.noiDungMarkdown,
            action: 'EDIT'
        });
        const formElement = document.getElementById('specialty-form-section');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handleDeleteSpecialty = async (specialty) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có chắc muốn xóa chuyên khoa: ${specialty.ten}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vâng, xóa đi!',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await specialtyService.deleteSpecialty(specialty.id);
                if (res && res.errCode === 0) {
                    toast.success("Đã xóa chuyên khoa!");
                    this.fetchAllSpecialties();
                    this.handleReset();
                } else {
                    toast.error("Xóa thất bại!");
                }
            }
        })
    }

    handleReset = () => {
        this.setState({
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            description: '',
            previewImgURL: '',
            action: 'CREATE',
            id: ''
        });
    }

    render() {
        let { listSpecialties } = this.state;

        return (
            <div className="manage-specialty-container">
                <div className="ms-title">Quản lý Chuyên khoa</div>

                <div className="ms-content">

                    <div className="list-specialty-card">
                        <div className="card-header">Danh sách chuyên khoa hiện có</div>
                        <div className="card-body">
                            <div className="table-responsive custom-scrollbar">
                                <table className="table table-hover custom-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Hình ảnh</th>
                                            <th>Tên chuyên khoa</th>
                                            <th style={{ width: '30%' }}>Mô tả ngắn</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSpecialties && listSpecialties.length > 0 ?
                                            listSpecialties.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="img-thumbnail-small"
                                                                style={{ backgroundImage: `url(${item.hinhAnh})` }}>
                                                            </div>
                                                        </td>
                                                        <td className="fw-bold">{item.ten}</td>
                                                        <td>{item.moTa ? (item.moTa.length > 50 ? item.moTa.substring(0, 50) + '...' : item.moTa) : ''}</td>
                                                        <td>
                                                            <button className="btn-edit"
                                                                onClick={() => this.handleEditSpecialty(item)}
                                                            >
                                                                <i className="fas fa-pencil-alt"></i>
                                                            </button>
                                                            <button className="btn-delete"
                                                                onClick={() => this.handleDeleteSpecialty(item)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="5" className="text-center">Chưa có dữ liệu chuyên khoa</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="add-new-specialty-card" id="specialty-form-section">
                        <div className="card-header">
                            <span className="header-title">
                                {this.state.action === 'CREATE' ? 'Thêm mới chuyên khoa' : 'Cập nhật chuyên khoa'}
                            </span>
                            {this.state.action === 'EDIT' &&
                                <button className="btn-reset" onClick={() => this.handleReset()}>
                                    <i className="fas fa-plus"></i> Tạo mới
                                </button>
                            }
                        </div>

                        <div className="card-body">
                            <div className="row">
                                <div className="col-6 form-group">
                                    <label className="input-label">Tên chuyên khoa</label>
                                    <input className="form-control custom-input" type="text"
                                        value={this.state.name}
                                        placeholder="Ví dụ: Cơ xương khớp..."
                                        onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label className="input-label">Ảnh đại diện</label>
                                    <div className="upload-image-container">
                                        <input id="previewImg" type="file" hidden
                                            onChange={(event) => this.handleOnChangeImage(event)} />
                                        <label className="label-upload" htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i></label>
                                        <div className="preview-image"
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={() => this.openPreviewImage}
                                        >
                                            {!this.state.previewImgURL && <span>Preview</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 form-group" style={{ marginTop: '15px' }}>
                                    <label className="input-label">Mô tả ngắn</label>
                                    <textarea className="form-control custom-input" rows="3"
                                        value={this.state.description}
                                        onChange={(event) => this.handleOnChangeInput(event, 'description')}
                                    ></textarea>
                                </div>

                                <div className="col-12 md-editor-container">
                                    <label className="input-label">Bài viết chi tiết</label>
                                    <MdEditor
                                        style={{ height: '350px', borderRadius: '8px', overflow: 'hidden' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={this.handleEditorChange}
                                        value={this.state.descriptionMarkdown}
                                    />
                                </div>
                                <div className="col-12 btn-action-container">
                                    <button className={this.state.action === 'CREATE' ? "btn-save-spec" : "btn-save-spec btn-update"}
                                        onClick={() => this.handleSaveNewSpecialty()}>
                                        {this.state.action === 'CREATE' ? 'Lưu thông tin' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);