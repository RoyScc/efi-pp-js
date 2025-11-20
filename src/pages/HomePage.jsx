import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getPosts, deletePost } from '/src/services/apiService.js';
import { useAuth } from '/src/context/authlogin.jsx';
import { useToast } from '/src/context/toast.jsx';


import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { confirmDialog } from 'primereact/confirmdialog';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const { showToast } = useToast();

    const loadPosts = async () => {
        setLoading(true);
        try {
            const response = await getPosts();
            setPosts(response.data);
        } catch (err) {
            console.error("Error al cargar posts:", err);
            setError("No se pudieron cargar los posts.");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    // Función para eliminar desde la lista sin ingresar al post
    const handleDelete = (postId) => {
        confirmDialog({
            message: '¿Eliminar este post directamente?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deletePost(postId);
                    showToast('success', 'Éxito', 'Post eliminado.');
                    loadPosts(); 
                } catch (err) {
                    showToast('error', 'Error', 'No se pudo eliminar.');
                }
            }
        });
    };

    if (loading) return <div className="flex justify-content-center p-5"><ProgressSpinner /></div>;
    if (error) return <Message severity="error" text={error} />;

    return (
        <div>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 style={{color: '#4b5563'}} className="text-2xl font-bold">Página Principal de Posts</h2>
                {user && 
                <span style={{color: '#4b5563'}} className="text-500 font-semibold">Rol actual: {user.role}</span>
                }
            </div>
            
            <div className="grid">
                {posts.length > 0 ? (
                    posts.map(post => {
                        const isOwnerOrAdmin = user && (user.role === 'admin' || user.sub == post.autor_id);

                        return (
                            <div key={post.id} className="col-12 md:col-6 lg:col-4 p-3">
                                <Card 
                                    title={post.titulo}
                                    subTitle={`Por: ${post.autor_id} - Fecha: ${new Date(post.fecha_creacion).toLocaleDateString()}`}
                                    className="h-full shadow-2"
                                    footer={
                                        <div className="flex justify-content-between align-items-center">
                                            {/* Botón publico para user */}
                                            <Link to={`/posts/${post.id}`}>
                                                <Button label="Ver Más" icon="pi pi-eye" className="p-button-text p-button-sm" />
                                            </Link>

                                            {/* Botones para admin y dueño del post */}
                                            {isOwnerOrAdmin && (
                                                <div className="flex gap-1">
                                                    <Link to={`/posts/${post.id}/edit`}>
                                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-text" aria-label="Editar" tooltip="Editar" />
                                                    </Link>
                                                    <Button 
                                                        icon="pi pi-trash" 
                                                        className="p-button-rounded p-button-danger p-button-text" 
                                                        aria-label="Eliminar" 
                                                        tooltip="Eliminar"
                                                        onClick={() => handleDelete(post.id)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    }
                                >
                                    <p className="m-0 text-secondary">
                                        {post.contenido.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                    </p>
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12">
                        <Message severity="info" text="No hay posts para mostrar." />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;