import { React, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './MainChat.css';

const MainChat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const username = sessionStorage.getItem('username');
    const color = sessionStorage.getItem('color');
    const messagesEndRef = useRef(null);
    const messagesListRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const socketConnection = io('http://127.0.0.1:3000');
        setSocket(socketConnection);

        socketConnection.on('broadcastMessage', (message, sender, color, timestamp) => {
            setMessages((prevMessages) => [...prevMessages, { message, sender, color, timestamp }]);
        }); 

        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const messagesList = messagesListRef.current;
        if (!messagesList) return;

        const isAtBottom =
            messagesList.scrollHeight - messagesList.scrollTop <= messagesList.clientHeight + 100;

        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (socket && message.trim() && username && color) {
            socket.emit('sendMessage', message, username, color);
            setMessage('');

            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 50);
        }
    };

    const disconnectUser = () => {
        if (socket && username) {
            socket.emit('userGone', username);
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("color");
            navigate("/login");

            return () => {
                if (socket) {
                    socket.off('userLeft'); // cleanup
                }
            };
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [message]);

    return (
        <div className='mainchat'>
            <button 
            className="leave"
            onClick={disconnectUser}
            >EXIT</button>
            <div className='messages-list' ref={messagesListRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === username ? 'yours' : 'not-yours'}`}
                    >
                        <p>
                        {msg.sender !== username && (
                            <span className="sender" style={{ color: msg.color }}>{msg.sender} <span className="timestamp">[{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span><br /></span>
                        )}
                        <span className="message-i">{msg.message}</span>
                        {msg.sender == username && (
                            <span className="sender-timestamp">[{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                        )}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="write">
                <input
                    value={message}
                    onChange={handleChange}
                    type='text'
                    placeholder='Write a message...'
                    className='mainchat__input'
                />
                <button onClick={sendMessage}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
            </div>
        </div>
    );
};

export default MainChat;
