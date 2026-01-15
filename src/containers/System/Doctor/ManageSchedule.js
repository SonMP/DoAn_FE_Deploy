import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from "react-toastify";
import _ from 'lodash';
import { doctorService } from '../../../services';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: []
        }
    }

    async componentDidMount() {
        this.props.fetchAllScheduleTime();
        let { userInfo } = this.props;
        if (userInfo && userInfo.maVaiTro === 'R1') {
            this.props.fetchAllDoctors();
        }

        else if (userInfo && userInfo.maVaiTro === 'R2') {
            let labelName = `${userInfo.ho} ${userInfo.ten}`;
            this.setState({
                selectedDoctor: {
                    label: labelName,
                    value: userInfo.id
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }

        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.ho} ${item.ten}`;
                let labelEn = `${item.ten} ${item.ho}`;

                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption }, () => {
            this.loadExistingSchedule();
        });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, () => {
            this.loadExistingSchedule();
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({ rangeTime: rangeTime })
        }
    }

    loadExistingSchedule = async () => {
        let { selectedDoctor, currentDate, rangeTime } = this.state;

        if (selectedDoctor && selectedDoctor.value && currentDate) {
            let formatedDate = new Date(currentDate).getTime();

            let res = await doctorService.getScheduleDoctorByDate(selectedDoctor.value, formatedDate);

            if (res && res.errCode === 0) {
                let existingSchedule = res.data;
                let newRangeTime = rangeTime.map(item => {
                    let isExist = existingSchedule.some(schedule => schedule.khungThoiGian === item.khoa);

                    item.isSelected = isExist;
                    return item;
                });

                this.setState({
                    rangeTime: newRangeTime
                })
            }
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];

        if (!currentDate) {
            toast.error("Chưa chọn ngày!");
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Chưa chọn bác sĩ!");
            return;
        }

        let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {

            let selectedTime = rangeTime.filter(item => item.isSelected === true);

            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {};
                    object.maBacSi = selectedDoctor.value;
                    object.date = formatedDate;
                    object.khungThoiGian = schedule.khoa;
                    result.push(object);
                })
            } else {
                toast.error("Chưa chọn khung giờ nào!");
                return;
            }
        }

        let res = await doctorService.saveBulkScheduleDoctor({
            arrSchedule: result,
            maBacSi: selectedDoctor.value,
            ngayHen: formatedDate
        });

        if (res && res.errCode === 0) {
            toast.success("Lưu lịch khám thành công!");
            let cleanRangeTime = [];
            if (rangeTime && rangeTime.length > 0) {
                cleanRangeTime = rangeTime.map(item => {
                    item.isSelected = false;
                    return item;
                })
            }

            this.setState({
                rangeTime: cleanRangeTime,
                currentDate: '',
            });

        } else {
            toast.error("Lỗi khi lưu lịch khám!");
            console.log('error saveBulkScheduleDoctor >>> ', res);
        }
    }

    handleAutoCreate7Days = async () => {
        let { selectedDoctor, currentDate } = this.state;
        let doctorId = '';

        if (this.props.userInfo.maVaiTro === "R2") {
            doctorId = this.props.userInfo.id;
        } else {
            if (selectedDoctor && !_.isEmpty(selectedDoctor)) {
                doctorId = selectedDoctor.value;
            }
        }

        if (!doctorId) {
            toast.error("Chưa chọn bác sĩ!");
            return;
        }

        if (!currentDate) {
            toast.error("Chưa chọn ngày bắt đầu!");
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        console.log("Calling API with:", doctorId, formatedDate);
        let res = await doctorService.saveBulkScheduleWeek({
            maBacSi: doctorId,
            date: formatedDate
        });

        if (res && res.errCode === 0) {
            toast.success("Đã tạo tự động lịch 7 ngày tới thành công!");
            this.loadExistingSchedule();
        } else {
            toast.error("Lỗi khi tạo lịch tự động");
            console.log('error bulk create', res);
        }
    }

    render() {
        let { rangeTime } = this.state;
        let { language, userInfo } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className="manage-schedule-container">
                <div className="schedule-card">

                    <div className="card-header">
                        <div className="title">
                            <FormattedMessage id="manage-schedule.title" defaultMessage="Quản lý kế hoạch khám bệnh" />
                        </div>
                    </div>

                    <div className="card-body">

                        <div className="filters-container">
                            <div className="form-group">
                                <label>
                                    {userInfo && userInfo.maVaiTro === 'R1' ?
                                        <FormattedMessage id="manage-schedule.choose-doctor" defaultMessage="Chọn bác sĩ" />
                                        :
                                        <FormattedMessage id="manage-schedule.doctor-label" defaultMessage="Bác sĩ" />
                                    }
                                </label>

                                {userInfo && userInfo.maVaiTro === 'R1' ? (
                                    <Select
                                        value={this.state.selectedDoctor}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.listDoctors}
                                        placeholder={'Chọn bác sĩ...'}
                                        classNamePrefix="react-select"
                                    />
                                ) : (
                                    <input
                                        className="form-control"
                                        value={this.state.selectedDoctor ? this.state.selectedDoctor.label : ''}
                                        disabled={true}
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label><FormattedMessage id="manage-schedule.choose-date" defaultMessage="Chọn ngày" /></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                    minDate={yesterday}
                                />
                            </div>
                            <div className="col-6 pt-4">
                                <button
                                    type="button"
                                    className="btn-auto-fill"
                                    onClick={() => this.handleAutoCreate7Days()}
                                >
                                    <i className="fas fa-magic"></i> &nbsp;
                                    Tự động điền 7 ngày tới
                                </button>
                            </div>
                        </div>

                        <div className="separator"></div>

                        <div className="time-slots-section">
                            <div className="section-title">
                                <i className="far fa-clock"></i>
                                <span><FormattedMessage id="manage-schedule.note" defaultMessage="Chọn các khung giờ làm việc" /></span>
                            </div>

                            <div className="time-slots-grid">
                                {rangeTime && rangeTime.length > 0 ? (
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button
                                                className={item.isSelected === true ? "btn-time-slot active" : "btn-time-slot"}
                                                key={index}
                                                onClick={() => this.handleClickBtnTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.giaTriVi : item.giaTriEn}
                                            </button>
                                        )
                                    })
                                ) : (
                                    <div className="no-data">
                                        <FormattedMessage id="manage-schedule.no-time-data" defaultMessage="Không có dữ liệu khung giờ (Vui lòng kiểm tra Redux/API)" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button
                            className="btn-save"
                            onClick={() => this.handleSaveSchedule()}
                        >
                            <FormattedMessage id="manage-schedule.save" defaultMessage="Lưu thông tin" />
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.doctors,
        allScheduleTime: state.admin.allScheduleTime,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleHour()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);