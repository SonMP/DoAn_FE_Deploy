import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MANAGE_ACTIONS } from "../../../utils";
import * as actions from "../../../store/actions";
import './UserRedux.scss';
import TableManageUser from './TableManageUser';
import ModalUser from './ModalUser';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenModalUser: false,
            action: '',
            userEdit: {}
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux();
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
            action: MANAGE_ACTIONS.CREATE,
            userEdit: {}
        })
    }

    handleEditUserFromParent = (user) => {
        this.setState({
            isOpenModalUser: true,
            action: MANAGE_ACTIONS.EDIT,
            userEdit: user
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    handleSaveUser = async (dataChild) => {
        let { action, userData } = dataChild;
        let res = null;

        if (action === MANAGE_ACTIONS.CREATE) {
            res = await this.props.createNewUser({
                email: userData.email,
                matKhau: userData.matKhau,
                ten: userData.ten,
                ho: userData.ho,
                diaChi: userData.diaChi,
                soDienThoai: userData.soDienThoai,
                gioiTinh: userData.gioiTinh,
                maVaiTro: userData.maVaiTro,
                maViTri: userData.maVaiTro === 'R3' ? null : userData.maViTri,
                hinhAnh: userData.hinhAnh
            });
        }

        if (action === MANAGE_ACTIONS.EDIT) {
            res = await this.props.editUserRedux({
                id: dataChild.id,
                email: userData.email,
                ten: userData.ten,
                ho: userData.ho,
                diaChi: userData.diaChi,
                soDienThoai: userData.soDienThoai,
                gioiTinh: userData.gioiTinh,
                maVaiTro: userData.maVaiTro,
                maViTri: userData.maVaiTro === 'R3' ? null : userData.maViTri,
                hinhAnh: userData.hinhAnh
            });
        }

        if (res && res.errCode === 0) {
            this.setState({
                isOpenModalUser: false
            });
        }
    }

    render() {
        return (
            <div className="user-redux-container">
                <div className="title">QUẢN LÝ NGƯỜI DÙNG</div>
                <div className="container">
                    <div className="my-3">
                        <button className="btn btn-primary" onClick={() => this.handleAddNewUser()}>
                            <i className="fas fa-plus"></i> Thêm mới người dùng
                        </button>
                    </div>

                    <TableManageUser
                        handleEditUserFromParentKey={this.handleEditUserFromParent}
                        action={this.state.action}
                    />
                </div>

                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    action={this.state.action}
                    userEdit={this.state.userEdit}
                    handleSaveUserFromParent={this.handleSaveUser}
                />
            </div>
        )
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
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        editUserRedux: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);