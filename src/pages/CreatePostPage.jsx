import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getCategories } from '../services/apiService';
import { useAuth } from '../context/authlogin.jsx';

import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

const CreatePostPage = () => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [categoriaId, setCategoriaId] = useState(null);
    
    const [categorias, setCategorias] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            setError(null);
            try {
                const response = await getCategories();
                const formattedCategorias = response.data.map(cat => ({
                    label: cat.nombre,
                    value: cat.id
                }));
                setCategorias(formattedCategorias);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setError("No se pudieron cargar las categorías. ¿El endpoint /api/categories funciona?");
            }
            setLoadingCategories(false);
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);

        const postData = {
            titulo: titulo,
            contenido: contenido,
            categoria_id: categoriaId,
            autor_id: user.sub,
            is_published: true 
        };

        try {
            await createPost(postData);
            navigate('/');
        } catch (err) {
            console.error("Error al crear post:", err);
            setError("Error al guardar el post. Revisa la consola.");
            setLoadingSubmit(false);
        }
    };

    if (loadingCategories) {
        return <div className="flex justify-content-center p-5"><ProgressSpinner /></div>;
    }

    if (error && !categorias.length) {
        return <Message severity="error" text={error} />;
    }
    
    return (
        <Card title="Crear Nuevo Post" className="w-full max-w-4xl m-auto">
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="field">
                    <label htmlFor="titulo">Título</label>
                    <InputText 
                        id="titulo" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        required 
                    />
                </div>

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
                    {categorias.length === 0 && !loadingCategories && (
                        <small className="p-error">
                            No hay categorías. Debes crear una en el backend (o con un seed) primero.
                        </small>
                    )}
                </div>

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
                    label="Publicar Post" 
                    type="submit" 
                    className="mt-4" 
                    loading={loadingSubmit}
                    disabled={categorias.length === 0}
                />
            </form>
        </Card>
    );
};

export default CreatePostPage;