import React, { Component } from 'react';
import { connect } from 'react-redux';
import { adminService } from '../../../services';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import './AdminDashboard.scss';

class AdminDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: {
                countDoctors: 0,
                countPatients: 0,
                countBookingToday: 0,
                countBookingDone: 0
            },
            pieChart: [],
            barChart: []
        }
    }

    async componentDidMount() {
        await this.getAllStats();
    }

    getAllStats = async () => {
        let res = await adminService.getAdminDashboardStats();
        if (res && res.errCode === 0) {
            this.setState({
                cards: res.data.cards,
                pieChart: res.data.pieChart,
                barChart: res.data.barChart
            })
        }
    }

    render() {
        const { cards, pieChart, barChart } = this.state;
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

        return (
            <div className="admin-dashboard-container">
                <div className="title">
                    Tổng quan hệ thống
                </div>

                <div className="dashboard-content">
                    <div className="row mb-4">
                        <div className="col-md-3 col-sm-6 mb-3">
                            <div className="stat-card gradient-1">
                                <i className="fas fa-user-md stat-icon"></i>
                                <div className="stat-content">
                                    <div className="stat-number">{cards.countDoctors}</div>
                                    <div className="stat-label">Tổng Bác sĩ</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6 mb-3">
                            <div className="stat-card gradient-2">
                                <i className="fas fa-procedures stat-icon"></i>
                                <div className="stat-content">
                                    <div className="stat-number">{cards.countPatients}</div>
                                    <div className="stat-label">Tổng Bệnh nhân</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-3">
                            <div className="stat-card gradient-3">
                                <i className="far fa-calendar-check stat-icon"></i>
                                <div className="stat-content">
                                    <div className="stat-number">{cards.countBookingToday}</div>
                                    <div className="stat-label">Lịch hẹn hôm nay</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-3">
                            <div className="stat-card gradient-4">
                                <i className="fas fa-check-double stat-icon"></i>
                                <div className="stat-content">
                                    <div className="stat-number">{cards.countBookingDone}</div>
                                    <div className="stat-label">Đã khám xong</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-7 mb-4">
                            <div className="chart-container">
                                <h3>Thống kê lượt khám hoàn thành (Năm nay)</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={barChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#888', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#888', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="url(#colorBar)"
                                            barSize={40}
                                            radius={[5, 5, 0, 0]}
                                            name="Số lượt khám"
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="col-md-5 mb-4">
                            <div className="chart-container">
                                <h3>Tỉ lệ trạng thái đặt lịch</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={pieChart}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieChart && pieChart.length > 0 && pieChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                                        <Legend
                                            iconType="circle"
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            wrapperStyle={{ paddingTop: '20px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);