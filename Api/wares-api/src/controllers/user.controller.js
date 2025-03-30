import { StatusCodes } from 'http-status-codes';
import { createUser, deleteUser, getAllUsers, getOne, updateUser } from '../business/user.business.js';
import { validationResult } from 'express-validator';
import { createUserValidatorSchema, updateUserValidatorSchema } from '../validators/user.validator.js';
import { body, param, query } from 'express-validator';

export const createUserController = [
    // Validaciones
    body(createUserValidatorSchema.type_document_id.in).isInt().notEmpty().exists().withMessage(createUserValidatorSchema.type_document_id.errorMessage),
    body(createUserValidatorSchema.user_type_id.in).isInt().notEmpty().exists().withMessage(createUserValidatorSchema.user_type_id.errorMessage),
    body(createUserValidatorSchema.email.in).isEmail().exists().withMessage(createUserValidatorSchema.email.errorMessage),
    // body(createUserValidatorSchema.name.in).optional().isString().withMessage('Name debe ser una cadena de texto.'), // Agregamos validación para name

    // Controlador
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        const newUser = await createUser(req.body);
        if (newUser instanceof Error) {
            if (newUser.message.startsWith("Debe de indicar un Tipo de Usuario Valido") || newUser.message.startsWith("Email ya Registrado")) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: newUser.message });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" });
            }
        }

        return res.status(StatusCodes.CREATED).json({
            description: "se ha Creado el Usuario correctamente",
            data: newUser,
        });
    }
];

export const createUserRegisterController = async (req, res) => {
    return createUserController(req, res);
};

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers(req.query);
        return res.status(StatusCodes.OK).json(users);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const getUsersWithPagination = [
    // Validaciones de paginación
    query('limit').isInt().optional().withMessage('Limit debe ser un número entero.'),
    query('page').isInt().optional().withMessage('Page debe ser un número entero.'),
    query('search_term').optional().isString().withMessage('search_term debe ser una cadena de texto.'),

    // Controlador para obtener usuarios con paginación
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        let { limit = 20, page = 1, search_term = null } = req.query;
        let offset = (page - 1) * limit;

        const users = await getAllUsers({ limit, offset, search_term });
        return res.status(StatusCodes.OK).json(users);
    }
];

export const updateUserController = [
    // Validaciones
    param(updateUserValidatorSchema.id.in).isInt().notEmpty().exists().withMessage(updateUserValidatorSchema.id.errorMessage),
    body(updateUserValidatorSchema.type_document_id.in).isInt().optional().withMessage(updateUserValidatorSchema.type_document_id.errorMessage),
    body(updateUserValidatorSchema.user_type_id.in).isInt().optional().withMessage(updateUserValidatorSchema.user_type_id.errorMessage),
    body(updateUserValidatorSchema.email.in).isEmail().optional().withMessage(updateUserValidatorSchema.email.errorMessage),
    body(updateUserValidatorSchema.name.in).optional().isString().withMessage('Name debe ser una cadena de texto.'), // Agregamos validación para name

    // Controlador
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        const params = req.params;
        const body = req.body;

        const updatedUser = await updateUser(params, body);
        if (updatedUser instanceof Error) {
            if (updatedUser.message.startsWith("Debe de indicar un Tipo de Usuario Valido") || updatedUser.message.startsWith('Debe de indicar un registro valido')) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: updatedUser.message });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: updatedUser.message });
            }
        }

        return res.status(StatusCodes.ACCEPTED).json({
            description: "se ha Actualizado el Usuario correctamente",
            data: updatedUser,
        });
    }
];

export const deletedUserController = async (req, res) => {
    const deletedUser = await deleteUser(req.params);
    if (deletedUser instanceof Error) {
        if (deletedUser.message.startsWith("Debe de indicar un registro valido")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: deletedUser.message });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" });
        }
    }
    res.json(deletedUser);
};

export const getOneController = async (req, res) => {
    const id = req.params;
    const userById = await getOne(id);
    if (userById instanceof Error) {
        if (userById.message.startsWith("Debe de indicar un registro valido")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: userById.message });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" });
        }
    }
    res.json(userById);
};