import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { userService, specialtyService } from '../../../services';
import { LANGUAGES, MANAGE_ACTIONS } from '../../../utils';
import { customStyles } from '../../../utils/CustomSelectStyle';

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noiDungMarkdown: '',
            noiDungHTML: '',
            moTa: '',

            listDoctors: [],
            selectedDoctor: null,

            donGia: '',

            listSpecialty: [],
            selectedSpecialty: [],

            hasOldData: false
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
        this.getAllSpecialty();
    }

    getAllSpecialty = async () => {
        let res = await specialtyService.getAllSpecialty();
        if (res && res.errCode === 0) {
            let dataSelect = this.buildDataInputSelect(res.data, 'SPECIALTY');
            this.setState({ listSpecialty: dataSelect });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({
                listDoctors: dataSelect
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.ho} ${item.ten}`;
                    let labelEn = `${item.ten} ${item.ho}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.ten;
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            noiDungMarkdown: text,
            noiDungHTML: html,
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleChangeSelectSpecialty = (selectedOption) => {
        this.setState({ selectedSpecialty: selectedOption });
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });

        let res = await userService.getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.thongTinChiTiet) {
            let thongTin = res.data.thongTinChiTiet;
            let listSpecialtySelected = [];
            if (thongTin.danhSachChuyenKhoa && thongTin.danhSachChuyenKhoa.length > 0) {
                listSpecialtySelected = thongTin.danhSachChuyenKhoa.map(item => ({
                    label: item.ten,
                    value: item.id
                }));
            }

            this.setState({
                noiDungHTML: thongTin.noiDungHTML,
                noiDungMarkdown: thongTin.noiDungMarkdown,
                moTa: thongTin.moTa,
                donGia: thongTin.donGia,
                selectedSpecialty: listSpecialtySelected,
                hasOldData: true
            })
        } else {
            this.setState({
                noiDungHTML: '',
                noiDungMarkdown: '',
                moTa: '',
                donGia: '',
                selectedSpecialty: [],
                hasOldData: false
            })
        }
    };

    handleEditDoctorFromTable = (doctor) => {
        let { language } = this.props;
        let labelVi = `${doctor.ho} ${doctor.ten}`;
        let labelEn = `${doctor.ten} ${doctor.ho}`;

        let selectedOption = {
            label: language === LANGUAGES.VI ? labelVi : labelEn,
            value: doctor.id
        }

        this.setState({
            selectedDoctor: selectedOption
        });

        this.handleChangeSelect(selectedOption);

        if (this.detailSectionRef) {
            this.detailSectionRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handleSaveInforDoctor = async () => {
        let { hasOldData, selectedSpecialty } = this.state;

        if (!this.state.selectedDoctor) {
            alert("Vui lòng chọn bác sĩ!");
            return;
        }

        let specialtyIds = [];
        if (selectedSpecialty && selectedSpecialty.length > 0) {
            specialtyIds = selectedSpecialty.map(item => item.value);
        }

        let res = await this.props.saveInforDoctor({
            maBacSi: this.state.selectedDoctor.value,
            noiDungHTML: this.state.noiDungHTML,
            noiDungMarkdown: this.state.noiDungMarkdown,
            moTa: this.state.moTa,
            donGia: this.state.donGia,

            specialtyIds: specialtyIds,

            action: hasOldData === true ? MANAGE_ACTIONS.EDIT : MANAGE_ACTIONS.CREATE
        });

        if (res && res.errCode === 0) {
            this.props.fetchAllDoctors();
            this.setState({
                noiDungHTML: '',
                noiDungMarkdown: '',
                moTa: '',
                donGia: '',
                selectedSpecialty: [],
                selectedDoctor: null,
                hasOldData: false
            })
        }
    }

    render() {
        let { allDoctors } = this.props;
        let { hasOldData, listSpecialty } = this.state;

        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">Quản lý thông tin bác sĩ</div>

                <div className="doctor-list-section container mt-4">
                    <div className="row">
                        <div className="col-12">
                            <h4><i className="fas fa-users"></i> Danh sách bác sĩ hiện có</h4>
                            <div className="table-responsive" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th style={{ width: '5%' }} className="text-center">STT</th>
                                            <th style={{ width: '20%' }}>Họ tên</th>
                                            <th style={{ width: '25%' }}>Chuyên khoa</th>
                                            <th style={{ width: '15%' }}>Đơn giá</th>
                                            <th style={{ width: '15%' }} className="text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allDoctors && allDoctors.length > 0 ?
                                            allDoctors.map((item, index) => {
                                                let detail = item.thongTinChiTiet || {};

                                                let listCK = "Chưa có";
                                                if (detail.danhSachChuyenKhoa && detail.danhSachChuyenKhoa.length > 0) {
                                                    listCK = detail.danhSachChuyenKhoa.map(ck => ck.ten).join(', ');
                                                }

                                                return (
                                                    <tr key={index}>
                                                        <td className="text-center">{index + 1}</td>
                                                        <td>{item.ho} {item.ten}</td>
                                                        <td>{listCK}</td>
                                                        <td>
                                                            {detail.donGia ? new Intl.NumberFormat('vi-VN').format(detail.donGia) + ' VND' : ''}
                                                        </td>
                                                        <td className="text-center">
                                                            <button className="btn-edit" onClick={() => this.handleEditDoctorFromTable(item)}>
                                                                <i className="fas fa-pencil-alt"></i> Sửa
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : <tr><td colSpan="5" className="text-center">Chưa có dữ liệu</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="doctor-detail-section" ref={(el) => { this.detailSectionRef = el; }}>
                    <h4>
                        <i className="fas fa-info-circle"></i>
                        {hasOldData ? `Cập nhật thông tin: ${this.state.selectedDoctor?.label || ''}` : "Tạo thông tin chi tiết"}
                    </h4>

                    <div className="row">
                        <div className="col-4 form-group">
                            <label>Chọn bác sĩ</label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                                placeholder={'Tìm kiếm bác sĩ...'}
                            />
                        </div>

                        <div className="col-4 form-group">
                            <label>Đơn giá khám</label>
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    onChange={(event) => this.handleOnChangeText(event, 'donGia')}
                                    value={this.state.donGia}
                                    placeholder="VD: 500000"
                                    type="number"
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">VND</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-4 form-group">
                            <label>Chọn Chuyên Khoa (Chọn được nhiều)</label>
                            <Select
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectSpecialty}
                                options={this.state.listSpecialty}
                                placeholder={'Chọn chuyên khoa...'}
                                isMulti={true}
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Thông tin giới thiệu (Mô tả ngắn):</label>
                            <textarea className="form-control" rows="4"
                                onChange={(event) => this.handleOnChangeText(event, 'moTa')}
                                value={this.state.moTa}
                                placeholder="Viết vài dòng giới thiệu về bác sĩ..."
                            >
                            </textarea>
                        </div>
                    </div>

                    <div className="manage-doctor-editor">
                        <MdEditor
                            style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.noiDungMarkdown}
                        />
                    </div>
                    <button
                        className={hasOldData ? "btn-save-infor is-edit" : "btn-save-infor"}
                        onClick={() => this.handleSaveInforDoctor()}
                    >
                        {hasOldData ?
                            <span><i className="fas fa-save"></i> Lưu thay đổi</span> :
                            <span><i className="fas fa-plus-circle"></i> Tạo thông tin</span>
                        }
                    </button>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveInforDoctor: (data) => dispatch(actions.saveInforDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);