import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authlogin.jsx';
import { useNavigate, Link } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';

const API_URL = 'http://localhost:5000/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login`, {
                username: username,
                password: password
            });

            const { token } = response.data;
            login(token);
            navigate('/');

        } catch (err) {
            console.error("Error en el login:", err);
            if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Error al iniciar sesión. Intenta de nuevo.");
            }
            setLoading(false);
        }
    };

    const footer = (
        <div className="text-center mt-3">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>
    );

    return (
        <div className="flex justify-content-center align-items-center min-h-screen p-8">
            <Card title="Iniciar Sesión" className="w-full max-w-md" footer={footer}>
                <form onSubmit={handleSubmit} className="mt-4 p-fluid">
                    <div className="field">
                        <label htmlFor="username">Usuario</label>
                        <InputText 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <Password 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            feedback={false}
                            toggleMask
                        />
                    </div>

                    <div className="mt-3">
                        {error && <Message severity="error" text={error} className="w-full justify-content-start" />}
                    </div>

                    <Button 
                        label="Entrar" 
                        type="submit" 
                        className="w-full mt-4" 
                        loading={loading}
                    />
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;