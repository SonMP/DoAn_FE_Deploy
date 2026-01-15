import React, { Component } from 'react';
import { connect } from "react-redux";
import './AllSpecialty.scss';
import { specialtyService } from '../../../services';

class AllSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
            searchKeyword: ''
        }
    }

    async componentDidMount() {
        let res = await specialtyService.getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    handleOnChangeSearch = (event) => {
        this.setState({ searchKeyword: event.target.value });
    }

    render() {
        let { dataSpecialty, searchKeyword } = this.state;

        let filteredSpecialty = dataSpecialty.filter(item =>
            item.ten.toLowerCase().includes(searchKeyword.toLowerCase())
        );

        return (
            <>
                <div className="all-specialty-container">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="title">Tất cả Chuyên khoa</h2>
                            <div className="search-box">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm chuyên khoa..."
                                    onChange={this.handleOnChangeSearch}
                                    value={searchKeyword}
                                />
                            </div>
                        </div>

                        <div className="specialty-grid">
                            {filteredSpecialty && filteredSpecialty.length > 0 ?
                                filteredSpecialty.map((item, index) => {
                                    return (
                                        <div className="specialty-card" key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div className="card-img" style={{ backgroundImage: `url(${item.hinhAnh})` }}></div>
                                            <div className="card-body">
                                                <div className="spec-name">{item.ten}</div>
                                                {/* Hiển thị mô tả ngắn nếu có */}
                                                <div className="spec-desc">
                                                    {item.moTa ? item.moTa : 'Chuyên khoa uy tín, bác sĩ đầu ngành...'}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-data">Không tìm thấy chuyên khoa phù hợp</div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

export default connect(mapStateToProps)(AllSpecialty);