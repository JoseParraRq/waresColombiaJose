import { query } from '../database/database.js'; // Asegúrate de que la ruta sea correcta

export const createUserType = async (params) => {
    try {
        const { name } = params;
        if (!name) {
            throw new Error('Nombre no puede ser vacio');
        }
        const result = await query('INSERT INTO user_type (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
    } catch (error) {
        return error;
    }
};

export const getAllUserTypes = async () => {
    try {
        const result = await query('SELECT * FROM user_type');
        return {
            successfull: 'se ha listado correctamente los tipos de usuarios',
            data: result.rows,
        };
    } catch (error) {
        return error;
    }
};

export const updateUserType = async (params, body) => {
    try {
        const { id } = params;
        const { name } = body;
        const result = await query('UPDATE user_type SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        if (result.rows.length === 0) {
            throw new Error('Debe de indicar un registro valido');
        }
        return result.rows[0];
    } catch (error) {
        return error;
    }
};

export const deleteUserType = async (params) => {
    try {
        const { id } = params;
        const result = await query('DELETE FROM user_type WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            throw new Error('Debe de indicar un registro valido');
        }
        return result.rows[0];
    } catch (error) {
        return error;
    }
};

export const getOneUserType = async (params) => {
    try {
        const { id } = params;
        const result = await query('SELECT * FROM user_type WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Debe de indicar un registro valido');
        }
        return result.rows[0];
    } catch (error) {
        return error;
    }
};