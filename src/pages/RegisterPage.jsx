import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

//  Importamos los componentes de PrimeReact 
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';

// api
const API_URL = 'http://localhost:5000/api'; 

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); 
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate();


    const roles = [
        { label: 'Usuario', value: 'user' },
        { label: 'Administrador', value: 'admin' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true); 

        const payload = {
            username: name,
            email: email,
            password: password,
            role: role 
        };

        try {
            await axios.post(`${API_URL}/register`, payload);
            setSuccess('¡Usuario registrado! Redirigiendo a login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Error en el registro:", err);
            if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Error al registrar. Intenta de nuevo.");
            }
            setLoading(false); // Reactivamos el botón si hay error
        }
    };

    const footer = (
        <div className="text-center mt-3">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
        </div>
    );

    return (
        <div className="flex justify-content-center align-items-center min-h-screen p-4">
            
            <Card title="Crear Cuenta" className="w-full max-w-4xl" footer={footer}>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="formgrid grid">
                        
                        {/* (username) */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Nombre (Usuario)</label>
                            <InputText 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full" 
                            />
                        </div>

                        {/*  email */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">Email</label>
                            <InputText 
                                id="email" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="w-full" 
                            />
                        </div>

                        {/* contraseña */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="password">Contraseña</label>
                            <Password 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full" 
                                inputClassName="w-full" 
                                feedback={false}
                                toggleMask 
                            />
                        </div>

                        {/* Dropdown componente react */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="role">Rol</label>
                            <Dropdown 
                                id="role" 
                                value={role} 
                                options={roles} 
                                onChange={(e) => setRole(e.value)} 
                                className="w-full" 
                            />
                        </div>
                    </div>

                    {/* Mensajes de error o exito */}
                    <div className="mt-3">
                        {error && <Message severity="error" text={error} className="w-full justify-content-start" />}
                        {success && <Message severity="success" text={success} className="w-full justify-content-start" />}
                    </div>

                    {/* Botón de Submit */}
                    <Button 
                        label="Registrarse" 
                        type="submit" 
                        className="w-full mt-4" 
                        loading={loading} // Muestra un spinner si está cargando
                    />
                </form>
            </Card>
        </div>
    );
};

export default RegisterPage;