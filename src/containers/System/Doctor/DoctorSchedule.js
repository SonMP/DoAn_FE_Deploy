import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment';
import 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { doctorService } from '../../../services/';
import { FormattedMessage } from 'react-intl';
import BookingModal from '../../System/Doctor/Modal/BookingModal';
import { toast } from "react-toastify";

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            selectedDate: 0
        }
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);

        if (this.props.doctorIdFromParent) {
            this.setState({
                allDays: allDays
            }, async () => {
                if (this.props.dateFromChatbot) {
                    await this.autoOpenModalFromChatbot();
                } else {
                    let res = await doctorService.getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
                    this.setState({
                        allAvailableTime: res.data ? res.data : [],
                        selectedDate: allDays[0].value
                    })
                }
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays
            })
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await doctorService.getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : [],
                selectedDate: allDays[0].value
            })
        }

        if (this.props.dateFromChatbot !== prevProps.dateFromChatbot && this.props.dateFromChatbot) {
            await this.autoOpenModalFromChatbot();
        }
    }

    autoOpenModalFromChatbot = async () => {
        let { dateFromChatbot, timeFromChatbot, doctorIdFromParent } = this.props;

        if (dateFromChatbot && doctorIdFromParent) {
            let date = new Date(parseInt(dateFromChatbot)).setHours(0, 0, 0, 0);
            let res = await doctorService.getScheduleDoctorByDate(doctorIdFromParent, date);

            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                    selectedDate: date
                }, () => {
                    if (timeFromChatbot && this.state.allAvailableTime.length > 0) {
                        let targetHour = timeFromChatbot.split(':')[0].trim();
                        if (targetHour.length === 1) targetHour = '0' + targetHour;

                        let found = this.state.allAvailableTime.find(item => {
                            let timeLabel = item.thoiGianData ? item.thoiGianData.giaTriVi : '';
                            return timeLabel.startsWith(targetHour);
                        });

                        if (found) {
                            this.handleClickScheduleTime(found);
                        }
                    }
                });
            }
        }
    }

    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').locale('vi').format('dddd - DD/MM');
                    object.label = labelVi.charAt(0).toUpperCase() + labelVi.slice(1);
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format("ddd - DD/MM");
                }
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    }

    checkHasValidTime = (scheduleList) => {
        let currentHour = new Date().getHours();
        if (!scheduleList || scheduleList.length === 0) return false;

        let valid = scheduleList.filter(item => {
            let timeVi = item.thoiGianData ? item.thoiGianData.giaTriVi : '';
            if (timeVi) {
                let timeStart = parseInt(timeVi.split(':')[0]);
                return timeStart > (currentHour + 2);
            }
            return false;
        });
        return valid.length > 0;
    }

    openNearestSchedule = async () => {
        let doctorId = this.props.doctorIdFromParent;
        let res = await doctorService.getScheduleDates(doctorId);

        if (res && res.errCode === 0 && res.data && res.data.length > 0) {
            let foundDate = null;
            let foundSchedule = [];

            for (let i = 0; i < res.data.length; i++) {
                let dateDB = res.data[i].ngayHen;
                let dateTimestamp = 0;

                if (typeof dateDB === 'string') {
                    dateTimestamp = new Date(dateDB).getTime();
                } else {
                    dateTimestamp = Number(dateDB);
                }

                if (isNaN(dateTimestamp)) continue;

                let dateDBObj = new Date(dateTimestamp).setHours(0, 0, 0, 0);
                let todayObj = new Date().setHours(0, 0, 0, 0);

                if (dateDBObj < todayObj) continue;

                let resTime = await doctorService.getScheduleDoctorByDate(doctorId, dateTimestamp);
                let availableTime = resTime.data ? resTime.data : [];

                if (availableTime && availableTime.length > 0) {
                    if (dateDBObj === todayObj) {
                        let hasTime = this.checkHasValidTime(availableTime);
                        if (hasTime) {
                            foundDate = dateTimestamp;
                            foundSchedule = availableTime;
                            break;
                        }
                    }
                    else {
                        foundDate = dateTimestamp;
                        foundSchedule = availableTime;
                        break;
                    }
                }
            }

            if (foundDate) {
                this.setState({
                    selectedDate: foundDate,
                    allAvailableTime: foundSchedule
                });
                toast.info("Đã chuyển đến lịch trống gần nhất!")
            }
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && event.target.value !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = parseInt(event.target.value);

            let res = await doctorService.getScheduleDoctorByDate(doctorId, date);

            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                    selectedDate: date
                })
            }
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    getFilterScheduleTime = () => {
        let { allAvailableTime, selectedDate } = this.state;

        let today = new Date().setHours(0, 0, 0, 0);
        let selected = new Date(Number(selectedDate)).setHours(0, 0, 0, 0);
        if (allAvailableTime && allAvailableTime.length > 0) {
            if (selected === today) {
                let currentHour = new Date().getHours();

                return allAvailableTime.filter(item => {
                    let timeVi = item.thoiGianData ? item.thoiGianData.giaTriVi : '';

                    if (!timeVi && item.thoiGianData && item.thoiGianData.giaTriVi) {
                        timeVi = item.thoiGianData.giaTriVi;
                    }

                    if (timeVi) {
                        let startHour = parseInt(timeVi.split(':')[0]);
                        return startHour > currentHour + 2;
                    }

                    return true;
                })
            }
        }
        return allAvailableTime;
    }

    render() {
        let { allDays, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language, priceDoctor, detailDoctorFromParent } = this.props;
        let availableTimeList = this.getFilterScheduleTime();
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt"></i>
                            <span>
                                <FormattedMessage id="header.detail-doctor.schedule" defaultMessage="Lịch khám" />
                            </span>
                        </div>

                        <div className="time-select-container">
                            <select
                                onChange={(event) => this.handleOnChangeSelect(event)}
                                value={this.state.selectedDate}
                            >
                                {allDays && allDays.length > 0 &&
                                    allDays.map((item, index) => {
                                        return (
                                            <option value={item.value} key={index}>
                                                {item.label}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                            <i className="fas fa-chevron-down select-icon"></i>
                        </div>
                    </div>

                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-clock"></i>
                            <span>
                                <FormattedMessage id="header.detail-doctor.available-time" defaultMessage="Khung giờ còn trống" />
                            </span>
                        </div>

                        <div className="time-content-btns">
                            {availableTimeList && availableTimeList.length > 0 ?
                                <>
                                    <div className="btns-grid">
                                        {availableTimeList.map((item, index) => {
                                            let timeDisplay = '';
                                            if (item.thoiGianData) {
                                                timeDisplay = language === LANGUAGES.VI ?
                                                    item.thoiGianData.giaTriVi : item.thoiGianData.giaTriEn;
                                            } else {
                                                timeDisplay = item.khungThoiGian;
                                            }
                                            let isBooked = item.daBiDat === true;
                                            return (
                                                <button
                                                    key={index}
                                                    className={`${language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'} ${isBooked ? 'disabled-btn' : ''}`}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="header.detail-doctor.choose" defaultMessage="Chọn" />
                                            <i className="far fa-hand-point-up"></i>
                                            <FormattedMessage id="header.detail-doctor.book-free" defaultMessage="đặt lịch miễn phí" />
                                        </span>
                                    </div>
                                </>
                                :
                                <div className="no-schedule">
                                    <i className="fas fa-info-circle"></i>
                                    <FormattedMessage id="header.detail-doctor.no-schedule" defaultMessage="Bác sĩ không có lịch hẹn trong ngày này, vui lòng chọn ngày khác." />
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingClose}
                    dataTime={dataScheduleTimeModal}
                    price={priceDoctor}
                    detailDoctorFromParent={detailDoctorFromParent}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DoctorSchedule);