import { Router } from 'express';
import {
    getUserTypes,
    createUserTypes,
    deletedUserType,
    updateUserTypes,
    getOne,
} from '../controllers/userType.controller.js';

const router = Router();

// Rutas de UserTypes

// Obtener todos los tipos de usuario
router.get('/user-types', getUserTypes);

// Crear un nuevo tipo de usuario
router.post('/user-types', createUserTypes);

// Actualizar un tipo de usuario por ID
router.put('/user-types/:id', updateUserTypes);

// Eliminar un tipo de usuario por ID
router.delete('/user-types/:id', deletedUserType);

// Obtener un tipo de usuario por ID
router.get('/user-types/:id', getOne);

export default router;
