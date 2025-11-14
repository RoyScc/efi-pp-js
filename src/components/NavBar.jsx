import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/authlogin.jsx';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useToast } from '../context/toast.jsx';
import { useNavigate } from 'react-router-dom';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home (Posts)',
            icon: 'pi pi-fw pi-home',
            command: () => { navigate('/') }
        },
        {
            label: 'Crear Post',
            icon: 'pi pi-fw pi-plus',
            command: () => { navigate('/posts/new') }
        }
    ];

    const end = user ? (
        <div className="flex align-items-center gap-2">
            <span className="bg-primary p-2 p-mr-2">¡Hola, {user.email}</span>
            <Button 
                label="Cerrar Sesión" 
                icon="pi pi-sign-out" 
                className="bg-red-500 p-button-text p-button-sm" 
                onClick={logout} 
            />
        </div>
    ) : (
        <Link to="/login">
            <Button label="Iniciar Sesión" icon="pi pi-sign-in" className="p-button-text p-button-sm" />
        </Link>
    );

    return (
        <div>
            <Menubar model={items} end={end} />
            
            <div className="p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;