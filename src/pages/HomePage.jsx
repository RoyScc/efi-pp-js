import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/apiService.js'; // Aseguramos .js
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // cargo los posts
        const loadPosts = async () => {
            setLoading(true);
            setError(null);
            try {

                const response = await getPosts();
                setPosts(response.data); 
            } catch (err) {
                console.error("Error al cargar posts:", err);
                setError("No se pudieron cargar los posts. (¿El backend está corriendo?)");
            }
            setLoading(false);
        };

        loadPosts(); 
    }, []);


    if (loading) {
        return <div className="flex justify-content-center p-5"><ProgressSpinner /></div>;
    }

    if (error) {
        return <Message severity="error" text={error} />;
    }


    return (
        <div>
            <div style={{ color: '#4b5563'}} className="text-lg p-2">
                <h2 className="text-lg font-semibold">Listado de Post</h2>
            </div>
            
            <div className="grid">
                {posts.length > 0 ? ( //si...
                    posts.map(post => (
                        <div key={post.id} className="col-12 md:col-6 lg:col-4 p-3">
                            <Card 
                                title={post.titulo}
                                subTitle={`Por: ${post.autor_id} - Fecha: ${new Date(post.fecha_creacion).toLocaleDateString()}`}
                                footer={
                                    <span>
                                        <Link to={`/posts/${post.id}`}>
                                            <Button label="Ver Más" icon="pi pi-search" className="p-button-sm" />
                                        </Link>                                       
                                    </span>
                                }
                            >
                                <p className="m-0">
                                    {post.contenido.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                </p>
                            </Card>
                        </div>
                    ))
                ) : ( //sino.. muestra este mensaje 
                    <p>No hay posts para mostrar. ¡Crea el primero!</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;