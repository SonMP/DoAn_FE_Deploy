import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { userService } from '../../services';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let data = await userService.getAllUsers('ALL');
        if (data && data.errCode === 0) {
            this.setState({
                arrUsers: data.users
            })
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleShowModalUser = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    handleDeleteUser = async (user) => {
        let message = `Bạn có chắc chắn muốn xóa người dùng: ${user.email} không?`;

        let isConfirmed = window.confirm(message);

        if (isConfirmed) {
            try {
                let response = await userService.deleteUserService(user.id);

                if (response && response.errCode !== 0) {
                    alert(response.message);
                } else {
                    await this.getAllUsersFromReact();
                    alert('Đã xóa thành công!');
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }
    toggleShowModalEditUser = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }
    createNewUser = async (data) => {
        try {
            let response = await userService.createUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.message);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })
            }
        } catch (e) {
            console.log(e)
        }
        console.log(data)
    }
    doEditUser = async (user) => {
        try {

            let response = await userService.editUserService(user);
            if (response && response.errCode !== 0) {
                alert(response.message)
            } else {
                this.setState({
                    isOpenModalEditUser: false,
                })
                await this.getAllUsersFromReact();
            }
        } catch (e) {
            console.log(e)
        }

    }
    render() {
        let { arrUsers } = this.state;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFormParent={this.toggleShowModalUser}
                    createNewUser={this.createNewUser} />

                <ModalEditUser
                    isOpen={this.state.isOpenModalEditUser}
                    toggleFormParent={this.toggleShowModalEditUser}
                    currentUser={this.state.userEdit}
                    editUser={this.doEditUser}
                />

                <div className="title text-center">
                    Quản lý người dùng hệ thống
                </div>

                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus"></i> Thêm người dùng mới
                    </button>
                </div>

                <div className="users-table mt-3 mx-1">
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Địa chỉ</th>
                                <th>Vai trò</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.ho}</td>
                                        <td>{item.ten}</td>
                                        <td>{item.diaChi}</td>
                                        <td>
                                            <span className={item.role === 'Admin' ? 'role-admin' : 'role-user'}>
                                                {item.maVaiTro}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => this.handleEditUser(item)}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteUser(item)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);