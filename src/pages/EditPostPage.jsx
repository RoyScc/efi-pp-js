import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost, getCategories } from '/src/services/apiService.js';
import { useToast } from '/src/context/toast.jsx';

//  Componentes PrimeReact 
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

const EditPostPage = () => {
    // Estados del formulario
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [categoriaId, setCategoriaId] = useState(null);
    const [categorias, setCategorias] = useState([]);
    
    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Hooks
    const { postId } = useParams(); // Lee el ID del post de la URL
    const navigate = useNavigate();
    const { showToast } = useToast();

    // 1. Cargar datos del post Y las categorías
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Hacemos ambas llamadas en paralelo
                const [postResponse, categoriesResponse] = await Promise.all([
                    getPost(postId),
                    getCategories()
                ]);

                // Procesamos el post
                const post = postResponse.data;
                setTitulo(post.titulo);
                setContenido(post.contenido);
                setCategoriaId(post.categoria_id);

                // Procesamos las categorías
                const formattedCategorias = categoriesResponse.data.map(cat => ({
                    label: cat.nombre,
                    value: cat.id
                }));
                setCategorias(formattedCategorias);

            } catch (err) {
                console.error("Error al cargar datos para editar:", err);
                setError("No se pudieron cargar los datos del post.");
            }
            setLoading(false);
        };
        loadData();
    }, [postId]); // Se ejecuta si el ID del post cambia

    // 2. Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const postData = {
            titulo,
            contenido,
            categoria_id: categoriaId
            // No enviamos autor_id, el backend no debería dejar cambiarlo
        };

        try {
            await updatePost(postId, postData);
            showToast('success', 'Éxito', 'Post actualizado correctamente.');
            navigate(`/posts/${postId}`); // Volvemos a la página de detalle
        } catch (err) {
            console.error("Error al actualizar post:", err);
            setError("Error al guardar los cambios.");
            setSubmitting(false);
        }
    };

    // Vistas de Estado
    if (loading) {
        return <div className="flex justify-content-center p-5"><ProgressSpinner /></div>;
    }

    if (error && !titulo) { // Si el error fue al cargar
        return <Message severity="error" text={error} />;
    }

    return (
        <Card title="Editar Post" className="w-full max-w-4xl m-auto">
            <form onSubmit={handleSubmit} className="p-fluid">
                
                {/* Título */}
                <div className="field">
                    <label htmlFor="titulo">Título</label>
                    <InputText 
                        id="titulo" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        required 
                    />
                </div>

                {/* Categoría */}
                <div className="field">
                    <label htmlFor="categoria">Categoría</label>
                    <Dropdown 
                        id="categoria"
                        value={categoriaId}
                        options={categorias}
                        onChange={(e) => setCategoriaId(e.value)}
                        placeholder="Selecciona una Categoría"
                        required
                        disabled={categorias.length === 0}
                    />
                </div>

                {/* Contenido */}
                <div className="field">
                    <label>Contenido</label>
                    <Editor 
                        style={{ height: '250px' }} 
                        value={contenido} 
                        onTextChange={(e) => setContenido(e.htmlValue)} 
                        required
                    />
                </div>

                {error && <Message severity="error" text={error} className="mt-3" />}

                <Button 
                    label="Guardar Cambios" 
                    type="submit" 
                    className="mt-4" 
                    loading={submitting}
                />
            </form>
        </Card>
    );
};

export default EditPostPage;