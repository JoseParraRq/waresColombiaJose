import { Alert, Snackbar } from '@mui/material';
import React, { useEffect } from 'react';

interface CustomAlertProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    autoHideDuration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ open, message, severity, onClose, autoHideDuration }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);

            return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o la alerta se cierra manualmente
        }
    }, [open, onClose, autoHideDuration]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={null} // Desactivar el autoHideDuration del Snackbar
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert;