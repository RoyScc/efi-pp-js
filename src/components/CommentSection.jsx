import React, { useState, useEffect } from 'react';
import { getComments, createComment, deleteComment } from '/src/services/apiService.js';
import { useAuth } from '/src/context/authlogin.jsx';
import { useToast } from '/src/context/toast';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { Avatar } from 'primereact/avatar';
import { confirmDialog } from 'primereact/confirmdialog';

const CommentsSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    
    const { user } = useAuth();
    const { showToast } = useToast();

    // Cargar comentarios
    const loadComments = async () => {
        try {
            const response = await getComments(postId);
            setComments(response.data);
        } catch (error) {
            console.error("Error cargando comentarios", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await createComment(postId, { texto: newComment });
            setNewComment(''); 
            showToast('success', 'Comentario enviado', 'Tu comentario ha sido publicado.');
            loadComments(); 
        } catch (error) {
            showToast('error', 'Error', 'No se pudo enviar el comentario.');
        }
    };

    // Eliminar comentario
    const handleDelete = (commentId) => {
        confirmDialog({
            message: '¿Eliminar este comentario?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await deleteComment(commentId);
                    showToast('success', 'Eliminado', 'Comentario eliminado.');
                    loadComments();
                } catch (error) {
                    showToast('error', 'Error', 'No se pudo eliminar.');
                }
            }
        });
    };


    const itemTemplate = (data) => {        
        const canDelete = user && (
            user.role === 'admin' || 
            user.role === 'moderator' || 
            user.sub == data.autor_id
        );

        return (
            <div className="col-12 p-3 border-bottom-1 surface-border">
                <div className="flex align-items-start">
                    <Avatar icon="pi pi-user" shape="circle" className="mr-2" />
                    <div className="flex-1">
                        <div className="flex justify-content-between align-items-center">
                            <span className="font-bold text-primary">
                                {data.autor_nombre || `Usuario #${data.autor_id}`}
                            </span>
                            <span className="text-sm text-500">
                                {new Date(data.fecha_creacion).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>{data.texto}</p>
                        
                        {canDelete && (
                            <div className="mt-2 text-right">
                                <Button 
                                    icon="pi pi-trash" 
                                    className="p-button-rounded p-button-danger p-button-text p-button-sm"
                                    onClick={() => handleDelete(data.id)}
                                    tooltip="Eliminar"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-5">
            <h3>Comentarios ({comments.length})</h3>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="field">
                        <InputTextarea 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            rows={3} 
                            className="w-full"
                            placeholder="Escribe tu opinión..."
                            autoResize
                        />
                    </div>
                    <div className="text-right">
                        <Button label="Comentar" icon="pi pi-send" type="submit" disabled={!newComment.trim()} />
                    </div>
                </form>
            ) : (
                <p className="text-500 mb-4">Inicia sesión para comentar.</p>
            )}

            {/* Lista de Comentarios */}
            {comments.length > 0 ? (
                <DataScroller value={comments} itemTemplate={itemTemplate} rows={5} inline scrollHeight="500px" />
            ) : (
                <p className="text-center font-italic">Sé el primero en comentar.</p>
            )}
        </div>
    );
};

export default CommentsSection;