import { React, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const goToChatRoom = () => {
        const color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("color", color);
        const socketConnection = io('https://yarn-backend-d8uw.onrender.com/');
        
        socketConnection.on('connect', () => {
            socketConnection.emit('joinRoom', username);
        });

        /* socketConnection.on('joinRoomSuccess', (message) => {
            console.log(message);
            window.location.href = "/";
        }); */

        socketConnection.on('errorMessage', (message) => {
            setError(message);
        });

        socketConnection.on('success', () => {
            navigate("/"); 
        });
    }

    return (
        <div className='login'>
            <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  />
            <button onClick={goToChatRoom}>CHAT</button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Login;