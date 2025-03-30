import { query } from "../database/database.js"; // Asegúrate de ajustar la ruta

// export const createUser = async (params) => {
//     try {
//         const { type_document_id, user_type_id, email } = params;

//         // Verificar si el email ya existe (puedes ajustar esto según tus necesidades)
//         const emailExists = await query('SELECT * FROM users WHERE email = $1', [email]);
//         if (emailExists.rows.length > 0) {
//             throw new Error('Email ya Registrado');
//         }

//         // Verificar si el userTypeId existe (puedes ajustar esto según tus necesidades)
//         const userTypeExists = await query('SELECT * FROM user_type WHERE id = $1', [user_type_id]);
//         if (userTypeExists.rows.length === 0) {
//             throw new Error('Debe de indicar un Tipo de Usuario Valido');
//         }

//         const result = await query('SELECT * FROM sp_users($1, $2, $3, $4)', [
//             'save_user',
//             null,
//             type_document_id,
//             user_type_id,
//             email,
//         ]);

//         return result.rows[0];
//     } catch (error) {
//         return error;
//     }
// };

export const createUser = async (params) => {
    try {
        const {
            type_document_id,
            user_type_id,
            email,
            name,
            document_number,
        } = params;

        // Verificar si el email ya existe
        const emailExists = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return {
                success: false,
                message: 'Email ya Registrado',
                data: null,
                totalCount: 0,
                hasMore: false,
            };
        }

        // Verificar si el userTypeId existe
        const userTypeExists = await query('SELECT * FROM user_type WHERE id = $1', [user_type_id]);
        if (userTypeExists.rows.length === 0) {
            return {
                success: false,
                message: 'Debe de indicar un Tipo de Usuario Valido',
                data: null,
                totalCount: 0,
                hasMore: false,
            };
        }

        const result = await query(
            'SELECT * FROM sp_users($1, $2, $3, $4, $5, $6, $7)',
            [
                'save_user',
                null, // p_id (no se usa para la creación)
                type_document_id,
                user_type_id,
                email,
                name,
                document_number,
            ]
        );

        if (result.rows.length > 0) {
            return {
                success: true,
                message: 'Usuario creado correctamente.',
                data: result.rows[0],
                totalCount: result.rows[0].total_count,
                hasMore: result.rows[0].has_more,
            };
        } else {
            return {
                success: false,
                message: 'Error al crear el usuario.',
                data: null,
                totalCount: 0,
                hasMore: false,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error al crear el usuario.',
            data: null,
            totalCount: 0,
            hasMore: false,
        };
    }
};


export const getAllUsers = async (params) => {
    try {
        const { limit = 10, offset = 0, search_term = null } = params;
        const result = await query('SELECT * FROM sp_users($1, null, null, null, null, null, null, $2, $3, $4)', [
            'list_users',
            limit,
            offset,
            search_term,
        ]);

        if (result.rows && result.rows.length > 0) {
            const users = result.rows.map(row => ({
                id: row.id,
                type_document_id: row.type_document_id,
                name_type_document_id: row.name_type_document_id,
                document_number: row.document_number,
                user_type_id: row.user_type_id,
                email: row.email,
                name: row.name,
                name_user_type: row.name_user_type,
            }));

            return {
                success: true,
                message: 'Usuarios listados correctamente.',
                data: users,
                totalCount: result.rows[0].total_count,
                hasMore: result.rows[0].has_more,
            };
        } else {
            return {
                success: true,
                message: 'No se encontraron usuarios.',
                data: [],
                totalCount: 0,
                hasMore: false,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Error al listar usuarios.',
            data: [],
            totalCount: 0,
            hasMore: false,
            error: error.message,
        };
    }
};

export const updateUser = async (params, body) => {
    try {
        const { id } = params;
        const { type_document_id, user_type_id, email } = body;

        // Verificar si el userTypeId existe (puedes ajustar esto según tus necesidades)
        const userTypeExists = await query('SELECT * FROM user_type WHERE id = $1', [user_type_id]);
        if (userTypeExists.rows.length === 0) {
            throw new Error('Debe de indicar un Tipo de Usuario valido');
        }

        // Verificar si el usuario existe (puedes ajustar esto según tus necesidades)
        const userExists = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            throw new Error('Debe de indicar un registro valido');
        }

        const result = await query('SELECT * FROM sp_users($1, $2, $3, $4, $5)', [
            'update_user',
            id,
            type_document_id,
            user_type_id,
            email,
        ]);

        return result.rows[0];
    } catch (error) {
        return error;
    }
};

export const deleteUser = async (params) => {
    try {
        const { id } = params;

        // Verificar si el usuario existe
        const userExists = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            return {
                success: false,
                message: 'Debe de indicar un registro valido',
                data: null,
                totalCount: 0,
                hasMore: false,
            };
        }

        // Ejecutar la eliminación
        await query('SELECT * FROM sp_users($1, $2)', ['delete_user', id]);

        return {
            success: true,
            message: 'Usuario eliminado correctamente.',
            data: null,
            totalCount: 0,
            hasMore: false,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error al eliminar el usuario.',
            data: null,
            totalCount: 0,
            hasMore: false,
        };
    }
};

export const getOne = async (params) => {
    try {
        const { id } = params;

        const userExists = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            return {
                success: false,
                message: 'Debe de indicar un registro valido',
                data: null,
                totalCount: 0,
                hasMore: false,
            };
        }

        const result = await query('SELECT * FROM sp_users($1, $2)', ['get_user', id]);

        if (result.rows.length > 0) {
            return {
                success: true,
                message: 'Usuario obtenido correctamente.',
                data: result.rows[0],
                totalCount: result.rows[0].total_count,
                hasMore: result.rows[0].has_more,
            };
        } else {
            return {
                success: false,
                message: 'No se encontró el usuario.',
                data: null,
                totalCount: 0,
                hasMore: false,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error al obtener el usuario.',
            data: null,
            totalCount: 0,
            hasMore: false,
        };
    }
};