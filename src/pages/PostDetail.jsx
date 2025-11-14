import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../services/apiService.js';
import { useAuth } from '../context/authlogin.jsx';
import { useToast } from '../context/toast.jsx';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { confirmDialog } from 'primereact/confirmdialog';

const PostDetailPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { postId } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPost(postId);
                setPost(response.data);
            } catch (err) {
                console.error("Error al cargar el post:", err);
                setError("No se pudo cargar el post.");
            }
            setLoading(false);
        };

        loadPost();
    }, [postId]);

    const handleDelete = () => {
        confirmDialog({
            message: '¿Estás seguro de que quieres eliminar este post? Esta acción es irreversible.',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí, Eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await deletePost(postId);
                    showToast('success', 'Éxito', 'Post eliminado correctamente.');
                    navigate('/');
                } catch (err) {
                    console.error("Error al eliminar post:", err);
                    showToast('error', 'Error', 'No se pudo eliminar el post.');
                }
            },
            reject: () => {
                showToast('info', 'Cancelado', 'La eliminación del post fue cancelada.');
            }
        });
    };

    if (loading) {
        return <div className="flex justify-content-center p-5"><ProgressSpinner /></div>;
    }

    if (error) {
        return <Message severity="error" text={error} />;
    }

    if (!post) {
        return <p>Post no encontrado.</p>;
    }

    const canModify = user && (user.role === 'admin' || user.sub == post.autor_id);

    const footer = (
        <div className="flex justify-content-between align-items-center">
            <Link to="/">
                <Button label="Volver a Inicio" icon="pi pi-arrow-left" className="p-button-text" />
            </Link>
            {canModify && (
                <div className="flex gap-2">
                    <Link to={`/posts/${postId}/edit`}> 
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-secondary p-button-sm" />
                    </Link>
                    <Button 
                        label="Eliminar" 
                        icon="pi pi-trash" 
                        className="p-button-danger p-button-sm"
                        onClick={handleDelete}
                    />
                </div>
            )}
        </div>
    );

    return (
        <Card 
            title={post.titulo} 
            subTitle={`Por: ${post.autor_id} - Fecha: ${new Date(post.fecha_creacion).toLocaleDateString()}`}
            footer={footer}
            className="w-full max-w-4xl m-auto"
        >
            <div dangerouslySetInnerHTML={{ __html: post.contenido }} />
        </Card>
    );
};

export default PostDetailPage;