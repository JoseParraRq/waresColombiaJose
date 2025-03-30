import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import useUsers from '../../hooks/useUsers';
import UserTable from './UserTable';
import FullScreenLoader from '../../shared/FullScreenLoader/FullScreenLoader';
import { User } from '../../interfaces/IUser.interfaces';
import UserModal from './UserModal';
import { deleteUser } from '../../services';
import CustomAlert from '../../shared/CustomAlert/CustomAlert';

const UserList = () => {
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>({} as User);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const params = {
    limit: 10, // Define los parámetros necesarios
    searchTerm: debouncedSearchTerm, // Define los parámetros necesarios
    silent: !initialLoadComplete
  };

  const { refetch } = useUsers(params);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = useUsers({ limit, searchTerm: debouncedSearchTerm, silent: !initialLoadComplete });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.9, // Aumentar el umbral
    rootMargin: '200px',
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && initialLoadComplete && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, initialLoadComplete]);



  useEffect(() => {
    if (status === 'success') {
      setInitialLoadComplete(true);
    }
  }, [data]);

  const allUsers = data?.pages.flatMap(page => page.data) || [];

  const handleDelete = (id: number) => {
    const findUser: User | undefined = allUsers.find(user => user.id === id);
    if (findUser) {
      setSelectedUser(findUser);
      handleOpenDeleteDialog(true);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const responseDelete = await deleteUser(id);
    if (responseDelete.success) {
      setAlertMessage('Usuario eliminado correctamente');
      setAlertSeverity('success');
      refetch();
    } else {
      setAlertMessage('Error al eliminar el usuario');
      setAlertSeverity('error');
    }
    setOpenAlert(true);
    handleOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog = (state: boolean) => {
    setOpenDeleteDialog(state);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      p: 3,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6" sx={{ marginTop: 'auto', textAlign: 'center', width: '100%', fontWeight: 'bold' }}>Listado de Usuarios: </Typography>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ marginTop: 'auto' }}>Buscar por Nombre, Email: </Typography>
        <TextField
          id="search"
          label="Buscar por Nombre, Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '80%', padding: 'auto' }}
        />
      </Box>

      <Paper sx={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: '4px',
          }
        }}>
          <UserTable users={allUsers} handleDelete={handleDelete} />

          <Box ref={loadMoreRef} sx={{
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {isFetchingNextPage && <FullScreenLoader isLoading={true} message="Cargando usuarios..." />}
            {!hasNextPage && <Typography>Fin de los resultados</Typography>}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={Link}
          to="/users/create"
          variant="contained"
        >
          Crear
        </Button>
      </Box>

      <UserModal
        openDeleteDialog={openDeleteDialog}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        selectedUser={selectedUser}
        onDelete={handleDeleteUser}
      />

      <CustomAlert
        open={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setOpenAlert(false)}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default UserList;