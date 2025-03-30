import { Router } from 'express';
import {
    createUserController,
    createUserRegisterController,
    deletedUserController,
    getOneController,
    getUsers,
    updateUserController,
    getUsersWithPagination, // Importa el nuevo controlador
} from '../controllers/user.controller.js';

const router = Router();

// Rutas de Usuarios

// Obtener todos los usuarios (Admin) con paginación y búsqueda
router.get('/users', getUsersWithPagination);

// Crear un nuevo usuario (Admin)
router.post('/users', createUserController);

// Registrar un nuevo usuario (Operario)
router.post('/users/register', createUserRegisterController);

// Actualizar un usuario por ID (Admin y Operario)
router.put('/users/:id', updateUserController);

// Eliminar un usuario por ID (Admin)
router.delete('/users/:id', deletedUserController);

// Obtener un usuario por ID (Admin y Operario)
router.get('/users/:id', getOneController);

export default router;