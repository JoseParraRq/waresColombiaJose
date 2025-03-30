import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import UserCard from './UserCard'; // Asegúrate de que esta ruta sea correcta
import { User } from '../../interfaces/IUser.interfaces';
import { Close, Delete } from '@mui/icons-material';

interface UserModalProps {
    openDeleteDialog: boolean;
    handleOpenDeleteDialog: (open: boolean) => void;
    selectedUser: User | null;
    onDelete: (userId: number) => void; // Función para eliminar al usuario
}

const UserModal: React.FC<UserModalProps> = ({ openDeleteDialog, handleOpenDeleteDialog, selectedUser, onDelete }) => {
    const handleDelete = () => {
        if (selectedUser) {
            onDelete(selectedUser.id); // Llama a la función de eliminar con el ID del usuario
            handleOpenDeleteDialog(false); // Cierra el modal después de eliminar
        }
    };

    return (
        <Dialog open={openDeleteDialog} onClose={() => handleOpenDeleteDialog(false)}>
            <DialogTitle>{openDeleteDialog ? '¿Desea eliminar el usuario?' : 'Detalles del Usuario'}</DialogTitle>
            <DialogContent>
                {selectedUser && (
                    <UserCard
                        user={selectedUser}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error" variant="contained" startIcon={<Delete />}>
                    Eliminar
                </Button>
                <Button onClick={() => handleOpenDeleteDialog(false)} color="primary" variant="contained" startIcon={<Close />}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserModal;