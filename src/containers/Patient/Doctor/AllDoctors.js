import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { doctorService } from '../../../services';
import { LANGUAGES } from '../../../utils';
import './AllDoctors.scss';

class AllDoctors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            searchKeyword: '',

            currentPage: 1,
            doctorsPerPage: 8
        };
    }

    async componentDidMount() {
        let res = await doctorService.getAllDoctorsService();
        if (res && res.errCode === 0) {
            this.setState({
                arrDoctors: res.data
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    handleOnChangeSearch = (event) => {
        this.setState({
            searchKeyword: event.target.value.toLowerCase(),
            currentPage: 1
        })
    }

    handleClickPage = (number) => {
        this.setState({
            currentPage: number
        })
    }

    render() {
        let { arrDoctors, searchKeyword, currentPage, doctorsPerPage } = this.state;
        let { language } = this.props;

        let filteredDoctors = arrDoctors.filter(item => {
            let nameVi = `${item.ho} ${item.ten}`.toLowerCase();
            let nameEn = `${item.ten} ${item.ho}`.toLowerCase();
            return nameVi.includes(searchKeyword) || nameEn.includes(searchKeyword);
        });

        const indexOfLastDoctor = currentPage * doctorsPerPage;
        const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
        const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredDoctors.length / doctorsPerPage); i++) {
            pageNumbers.push(i);
        }
        return (
            <>
                <div className="all-doctors-container">

                    <div className="search-hero-section">
                        <div className="overlay-bg"></div>
                        <div className="content-center">
                            <h2><FormattedMessage id="header.pro_specialty" defaultMessage="Đội ngũ bác sĩ ưu tú" /></h2>
                            <p>Chăm sóc sức khỏe toàn diện với chuyên gia hàng đầu</p>
                            <div className="search-box-modern">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder={language === LANGUAGES.VI ? "Tìm kiếm bác sĩ..." : "Search doctor..."}
                                    onChange={(e) => this.handleOnChangeSearch(e)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="doctor-list-body container">
                        <div className="row">
                            {currentDoctors && currentDoctors.length > 0 ?
                                currentDoctors.map((item, index) => {
                                    let nameVi = `${item.duLieuViTri.giaTriVi}, ${item.ho} ${item.ten}`;
                                    let nameEn = `${item.duLieuViTri.giaTriEn}, ${item.ten} ${item.ho}`;

                                    let tenChuyenKhoa = 'Đa khoa';
                                    if (item.thongTinChiTiet && item.thongTinChiTiet.danhSachChuyenKhoa) {
                                        let listCK = item.thongTinChiTiet.danhSachChuyenKhoa;
                                        if (listCK.length > 0) {
                                            tenChuyenKhoa = listCK.map(ck => ck.ten).join(', ');
                                        }
                                    }

                                    return (
                                        <div className="col-12 col-sm-6 col-lg-3 mb-4" key={index}>
                                            <div className="modern-doctor-card" onClick={() => this.handleViewDetailDoctor(item)}>
                                                <div className="card-img-wrapper">
                                                    <div className="bg-image" style={{ backgroundImage: `url(${item.hinhAnh})` }} />
                                                    <div className="overlay-hover">
                                                        <button className="btn-book-now"><FormattedMessage id="header.booking" /></button>
                                                    </div>
                                                </div>
                                                <div className="card-info">
                                                    <div className="doctor-position">
                                                        {tenChuyenKhoa}
                                                    </div>
                                                    <h3 className="doctor-name">
                                                        {language === LANGUAGES.VI ? nameVi : nameEn}
                                                    </h3>
                                                    <button className="btn-detail"><FormattedMessage id="header.view_detail" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-result">
                                    <i className="far fa-frown"></i>
                                    <span>Không tìm thấy bác sĩ phù hợp</span>
                                </div>
                            }
                        </div>

                        {pageNumbers.length > 1 &&
                            <div className="pagination-custom">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => this.handleClickPage(currentPage - 1)}
                                >
                                    &laquo;
                                </button>

                                {pageNumbers.map(number => (
                                    <button
                                        key={number}
                                        className={currentPage === number ? 'active' : ''}
                                        onClick={() => this.handleClickPage(number)}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === pageNumbers.length}
                                    onClick={() => this.handleClickPage(currentPage + 1)}
                                >
                                    &raquo;
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(AllDoctors);