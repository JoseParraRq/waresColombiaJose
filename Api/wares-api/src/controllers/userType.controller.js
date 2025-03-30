import { createUserType, deleteUserType, getAllUserTypes, getOneUserType, updateUserType } from '../business/userType.business.js'
import { StatusCodes } from 'http-status-codes';

export const getUserTypes = async (req, res) => {
    const getAll = await getAllUserTypes();
    if (getAll instanceof Error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: getAll.message })
    }
    res.json(getAll)
}

export const createUserTypes = async (req, res) => {
    const create = await createUserType(req.body);
    if (create instanceof Error) {
        if (create.message.startsWith("Nombre no puede ser vacio")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: create.message })
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" })
        }
    }
    res.status(StatusCodes.CREATED).json(create)
}

export const updateUserTypes = async (req, res) => {
    const updateBody = req.body;
    const updateParams = req.params;
    const update = await updateUserType(updateParams, updateBody)
    if (update instanceof Error) {
        if (update.message.startsWith("Debe de indicar un registro valido")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: update.message })
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" })
        }
    }
    res.json(update)
}

export const deletedUserType = async (req, res) => {
    const deleteUserTypeById = await deleteUserType(req.params);
    if (deleteUserTypeById instanceof Error) {
        if (deleteUserTypeById.message.startsWith("Debe de indicar un registro valido")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: deleteUserTypeById.message })
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" })
        }
    }
    res.json(deleteUserTypeById)
}

export const getOne = async (req, res) => {
    const id = req.params;
    const userTypeById = await getOneUserType(id)
    if (userTypeById instanceof Error) {
        if (userTypeById.message.startsWith("Debe de indicar un registro valido")) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: userTypeById.message })
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error interno de servidor" })
        }
    }
    res.json(userTypeById)
}