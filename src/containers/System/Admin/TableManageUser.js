import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions";
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt;

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [],
            currentPage: 0,
            usersPerPage: 8,
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn đang chuẩn bị xóa tài khoản: ${user.email}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vâng, xóa đi!',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.deleteUserRedux(user.id);
            }
        })
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
    }
    handlePageClick = (event) => {
        this.setState({
            currentPage: event.selected
        });
    };
    render() {
        let arrUsers = this.state.usersRedux;

        const offset = this.state.currentPage * this.state.usersPerPage;
        const currentUsers = arrUsers.slice(offset, offset + this.state.usersPerPage);
        const pageCount = Math.ceil(arrUsers.length / this.state.usersPerPage);
        return (
            <div className="users-table-container">
                <div className="users-table-wrapper">
                    <table id="customers">
                        <thead>
                            <tr>
                                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                                <th>Email</th>
                                <th>Họ và Tên</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th style={{ width: '150px', textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers && currentUsers.length > 0 ?
                                currentUsers.map((item, index) => {
                                    let stt = offset + index + 1;
                                    return (
                                        <tr key={index}>
                                            <td style={{ textAlign: 'center' }}>{stt}</td>
                                            <td>{item.email}</td>
                                            <td>{item.ho} {item.ten}</td>
                                            <td>{item.diaChi}</td>
                                            <td>{item.soDienThoai}</td>

                                            <td>
                                                {item.duLieuVaiTro && item.duLieuVaiTro.giaTriVi
                                                    ? item.duLieuVaiTro.giaTriVi
                                                    : item.maVaiTro
                                                }
                                            </td>

                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="btn-action btn-edit"
                                                    onClick={() => this.handleEditUser(item)}
                                                >
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() => this.handleDeleteUser(item)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                                        Chưa có dữ liệu người dùng
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    <div className="react-paginate-container">
                        <ReactPaginate
                            previousLabel={'< Trước'}
                            nextLabel={'Sau >'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);