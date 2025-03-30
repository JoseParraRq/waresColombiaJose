import React from 'react';
import './FullScreenLoader.css'; // Archivo CSS para los estilos

const FullScreenLoader = ({ isLoading, message }: { isLoading: boolean, message?: string }) => {
    if (!isLoading) return null;

    return (
        <div className="fullscreen-loader">
            <div className="loader-spinner"></div>
            <p>{message ? message : 'Cargando...'}</p>
        </div>
    );
};

export default FullScreenLoader;