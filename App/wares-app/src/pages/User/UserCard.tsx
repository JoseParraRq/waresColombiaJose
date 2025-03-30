import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Box,
  Divider
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { User } from '../../interfaces/IUser.interfaces';



interface UserCardProps {
  user: User;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onEdit }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(user.id);
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  return (
    <>
      {/* Card del Usuario */}
      <Card sx={{ 
        maxWidth: 345, 
        margin: 2,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {user.name}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Tipo de documento:</strong> {user.name_type_document_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Número de documento:</strong> {user.document_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Tipo de usuario:</strong> {user.name_user_type}
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        {/* Footer con botones */}

      </Card>

      {/* Modal de confirmación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al usuario <strong>{user.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={<Delete />}
          >
            {isDeleting ? 'Eliminando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserCard;