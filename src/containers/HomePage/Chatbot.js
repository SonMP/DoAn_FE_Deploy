import React, { Component } from 'react';
import { connect } from "react-redux";
import './Chatbot.scss';
import axios from 'axios';
import { withRouter } from 'react-router';
import Spinner from 'react-spinkit';
import botAvatar from '../../../src/assets/images/chat_avatar.jpg';
import { userService } from '../../services';

class Chatbot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            inputMsg: '',
            messages: [
                {
                    text: 'Xin chào! Tôi là Trợ lý sức khỏe AI. Tôi có thể giúp gì cho bạn hôm nay?',
                    isBot: true
                }
            ],
            isLoading: false
        }
        this.messagesEndRef = React.createRef();
    }

    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.id) {
            await this.getHistoryFromDb();
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length !== this.state.messages.length || prevState.isLoading !== this.state.isLoading) {
            this.scrollToBottom();
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            if (this.props.userInfo && this.props.userInfo.id) {
                await this.getHistoryFromDb();
            } else {
                this.setState({
                    messages: [
                        {
                            text: 'Xin chào! Tôi là Trợ lý sức khỏe AI. Tôi có thể giúp gì cho bạn hôm nay?',
                            isBot: true
                        }
                    ]
                });
            }
        }
    }

    getHistoryFromDb = async () => {
        if (!this.props.userInfo) return;
        try {
            let res = await userService.getChatHistory(this.props.userInfo.id)
            if (res && res.errCode === 0) {
                let dbMessages = res.data.map(item => ({
                    text: item.text,
                    isBot: item.isBot === 1 || item.isBot === true,
                    analysis: item.analysis,
                    advice: item.advice,
                    doctorName: item.doctorName,
                    specialtyId: item.specialtyId,
                    doctorId: item.doctorId,
                    date: item.date,
                    time: item.time
                }));

                if (dbMessages.length > 0) {
                    this.setState({
                        messages: [this.state.messages[0], ...dbMessages]
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    scrollToBottom = () => {
        this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    toggleChat = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleOnChange = (event) => {
        this.setState({ inputMsg: event.target.value });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSendMessage();
        }
    }

    handleSendMessage = async () => {
        if (!this.state.inputMsg.trim()) return;

        let userId = this.props.userInfo ? this.props.userInfo.id : null;
        let userMsg = { text: this.state.inputMsg, isBot: false };

        let currentMessages = [...this.state.messages, userMsg];

        this.setState({
            messages: currentMessages,
            inputMsg: '',
            isLoading: true
        });

        try {
            let historyForGuest = currentMessages.slice(-6).map(msg => ({
                text: msg.text || msg.analysis || "",
                isBot: msg.isBot
            }));

            let response = await userService.postChatbot({
                message: userMsg.text,
                userId: userId,
                history: historyForGuest
            });
            if (response && response.errCode === 0) {
                let botMsg = {
                    isBot: true,
                    analysis: response.analysis || response.reply,
                    advice: response.advice,
                    doctorName: response.doctorName,
                    specialtyId: response.specialtyId,
                    doctorId: response.doctorId,
                    date: response.date,
                    time: response.time
                };

                this.setState({
                    messages: [...currentMessages, botMsg],
                    isLoading: false
                });
            }
        } catch (e) {
            console.log(e);
            this.setState({
                messages: [...currentMessages, { text: "Xin lỗi, kết nối gián đoạn. Vui lòng thử lại.", isBot: true }],
                isLoading: false
            });
        }
    }

    handleViewSpecialty = (id) => {
        if (this.props.history) {
            const currentPath = this.props.location.pathname;
            const targetPath = `/detail-specialty/${id}`;
            if (currentPath.includes('/detail-specialty')) {
                window.location.href = targetPath;
            } else {
                this.props.history.push(targetPath);
            }
            this.toggleChat();
        }
    }

    handleViewDoctor = (msg) => {
        if (this.props.history) {
            let dateTimestamp = new Date().getTime();
            if (msg.date) {
                let parts = msg.date.split('/');
                if (parts.length === 3) {
                    let isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    dateTimestamp = new Date(isoDate).getTime();
                }
            }
            this.props.history.push({
                pathname: `/detail-doctor/${msg.doctorId}`,
                state: {
                    targetDate: dateTimestamp,
                    targetTime: msg.time
                }
            });
            this.toggleChat();
        }
    }

    render() {
        let { location } = this.props;
        const hiddenPaths = ['/login', '/system', '/doctor'];
        if (location && hiddenPaths.some(path => location.pathname.startsWith(path))) {
            return null;
        }

        let { isOpen, messages, inputMsg, isLoading } = this.state;

        return (
            <div className={`chatbot-container ${isOpen ? 'active' : ''}`}>
                <div className="chatbot-toggle-btn" onClick={this.toggleChat}>
                    {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-robot"></i>}
                </div>

                <div className="chatbot-window">
                    <div className="chat-header">
                        <div className="header-info">
                            <div className="bot-status-avatar">
                                <img src={botAvatar} alt="AI" />
                                <div className="online-dot"></div>
                            </div>
                            <div className="header-text">
                                <span className="name">Trợ lý Y Tế AI</span>
                                <span className="status">Hỗ trợ chẩn đoán sơ bộ</span>
                            </div>
                        </div>
                        <div className="header-actions" onClick={this.toggleChat}>
                            <i className="fas fa-minus"></i>
                        </div>
                    </div>

                    <div className="chat-body">
                        {!this.props.userInfo && (
                            <div style={{ padding: '10px', background: '#fff3cd', color: '#856404', fontSize: '13px', textAlign: 'center', marginBottom: '10px', borderRadius: '5px' }}>
                                <i className="fas fa-exclamation-triangle"></i> Bạn đang chat ẩn danh. <br />
                                <b><span onClick={() => this.props.history.push('/login')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Đăng nhập</span></b> để lưu lịch sử chat.
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.isBot && (
                                    <div className="bot-avatar-small">
                                        <img src={botAvatar} alt="bot" />
                                    </div>
                                )}

                                <div className="message-content">
                                    <div className="bubble">
                                        {msg.text && msg.text.length > 0 && <span>{msg.text}</span>}
                                        {msg.analysis && (
                                            <>
                                                {msg.text && msg.text.length > 0 && <br />}
                                                <span className="analysis-text">{msg.analysis}</span>
                                            </>
                                        )}
                                    </div>

                                    {msg.isBot === true && msg.advice && msg.advice.length > 0 && (
                                        <div className="advice-box">
                                            <div className="advice-title"><i className="fas fa-lightbulb"></i> Lời khuyên:</div>
                                            <div className="advice-content">{msg.advice}</div>
                                        </div>
                                    )}

                                    {msg.isBot === true && (msg.specialtyId > 0 || (msg.doctorName && msg.doctorName.length > 0)) && (
                                        <div className="suggestion-card">
                                            {msg.doctorName && msg.doctorName.length > 0 && (
                                                <div className="doctor-info">
                                                    <i className="fas fa-user-md"></i>
                                                    <span> Gợi ý: <strong>{msg.doctorName}</strong></span>
                                                </div>
                                            )}

                                            <div className="action-buttons">
                                                {msg.doctorId && msg.doctorId > 0 && (
                                                    <button className="btn-action primary"
                                                        onClick={() => this.handleViewDoctor(msg)}>
                                                        Đặt lịch Bác sĩ
                                                    </button>
                                                )}
                                                {msg.specialtyId && msg.specialtyId > 0 && (
                                                    <button className="btn-action secondary"
                                                        onClick={() => this.handleViewSpecialty(msg.specialtyId)}>
                                                        Xem Chuyên khoa
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message-wrapper bot typing">
                                <div className="bot-avatar-small">
                                    <img src={botAvatar} alt="bot" />
                                </div>
                                <div className="bubble typing-bubble">
                                    <Spinner name="three-bounce" color="#28a745" fadeIn="none" />
                                </div>
                            </div>
                        )}
                        <div ref={this.messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Mô tả triệu chứng của bạn..."
                                value={inputMsg}
                                onChange={this.handleOnChange}
                                onKeyDown={this.handleKeyDown}
                            />
                            <button className="send-btn" onClick={this.handleSendMessage} disabled={!inputMsg.trim()}>
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

export default withRouter(connect(mapStateToProps)(Chatbot));