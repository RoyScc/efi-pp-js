import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/authlogin.jsx';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';

const NavBar = () => {
    const { user, logout } = useAuth();

    let items = [
        {
            label: 'Home (Posts)',
            icon: 'pi pi-fw pi-home',
            command: () => { window.location.href = '/' } 
        }
    ];

    if (user) {
        items.push({
            label: 'Crear Post',
            icon: 'pi pi-fw pi-plus',
            command: () => { window.location.href = '/posts/new' }
        });
    }

    const end = user ? (
        <div className="flex align-items-center gap-2">
            <span className="p-mr-2">¡Hola, {user.username}!</span>
            <Button 
                label="Cerrar Sesión" 
                icon="pi pi-sign-out" 
                className="p-button-text p-button-sm" 
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
            <ConfirmDialog /> 
            <Menubar model={items} end={end} />
            <div className="p-4">
                <Outlet /> 
            </div>
        </div>
    );
};

export default NavBar;