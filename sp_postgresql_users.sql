
CREATE OR REPLACE FUNCTION public.sp_users(
    p_action character varying,
    p_id integer DEFAULT NULL::integer,
    p_type_document_id integer DEFAULT NULL::integer,
    p_user_type_id integer DEFAULT NULL::integer,
    p_email character varying DEFAULT NULL::character varying,
    p_name character varying DEFAULT NULL::character varying,
	p_document_number character varying DEFAULT NULL::character varying,
    p_limit integer DEFAULT 10,
    p_offset integer DEFAULT 0,
    p_search_term character varying DEFAULT NULL::character varying
)
RETURNS TABLE(id integer, type_document_id integer, user_type_id integer, email character varying, name character varying, document_number character varying, name_user_type character varying,name_type_document_id character varying,
    total_count integer,
    has_more boolean)
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 1000
AS $BODY$
	DECLARE
    error_message TEXT;
    total_records INT;
BEGIN
    IF p_action = 'create_user' THEN
        BEGIN
            INSERT INTO users (type_document_id, user_type_id, email, name)
            VALUES (p_type_document_id, p_user_type_id, p_email, 'Usuario Nuevo')
            RETURNING users.id, users.type_document_id, users.user_type_id, users.email, users.name;
        EXCEPTION
            WHEN others THEN
                error_message := SQLERRM;
                RAISE EXCEPTION 'Error al crear el usuario: %', error_message;
        END;
    ELSIF p_action = 'get_user' THEN
        BEGIN
            RETURN QUERY SELECT users.id, users.type_document_id, users.user_type_id, users.email, users.name
                         FROM users
                         WHERE users.id = p_id;
        EXCEPTION
            WHEN others THEN
                error_message := SQLERRM;
                RAISE EXCEPTION 'Error al obtener el usuario: %', error_message;
        END;
    ELSIF p_action = 'update_user' THEN
        BEGIN
            UPDATE users
            SET type_document_id = p_type_document_id,
                user_type_id = p_user_type_id,
                email = p_email,
                name = 'Usuario Actualizado'
            WHERE users.id = p_id
            RETURNING users.id, users.type_document_id, users.user_type_id, users.email, users.name;
        EXCEPTION
            WHEN others THEN
                error_message := SQLERRM;
                RAISE EXCEPTION 'Error al actualizar el usuario: %', error_message;
        END;
    ELSIF p_action = 'delete_user' THEN
        BEGIN
            DELETE FROM users
            WHERE users.id = p_id;
        EXCEPTION
            WHEN others THEN
                error_message := SQLERRM;
                RAISE EXCEPTION 'Error al eliminar el usuario: %', error_message;
        END;
    ELSIF p_action = 'list_users' THEN
       BEGIN
            -- Calcular el número total de registros
            IF p_search_term IS NULL THEN
                SELECT COUNT(*) INTO total_records
                FROM users;
            ELSE
                SELECT COUNT(*) INTO total_records
                FROM users u
                WHERE u.email ILIKE '%' || p_search_term || '%'
                   OR u.name ILIKE '%' || p_search_term || '%';
            END IF;

            -- Devolver los registros paginados y la información adicional
            IF p_search_term IS NULL THEN
                RETURN QUERY SELECT u.id, u.type_document_id, u.user_type_id, u.email, u.name, u.document_number, ut.name as name_user_type, tp.name as name_type_document_id, total_records, (total_records > (p_offset + p_limit))
                             FROM users u
                             INNER JOIN user_type ut ON ut.id = u.user_type_id
                             INNER JOIN type_document tp ON tp.id = u.type_document_id
                             ORDER BY u.id
                             LIMIT p_limit OFFSET p_offset;
            ELSE
                RETURN QUERY SELECT u.id, u.type_document_id, u.user_type_id, u.email, u.name, u.document_number, ut.name as name_user_type, tp.name as name_type_document_id, total_records, (total_records > (p_offset + p_limit))
                             FROM users u
                             INNER JOIN user_type ut ON ut.id = u.user_type_id
                             INNER JOIN type_document tp ON tp.id = u.type_document_id
                             WHERE u.email ILIKE '%' || p_search_term || '%'
                                OR u.name ILIKE '%' || p_search_term || '%'
                             ORDER BY u.id
                             LIMIT p_limit OFFSET p_offset;
            END IF;
        EXCEPTION
            WHEN others THEN
                error_message := SQLERRM;
                RAISE EXCEPTION 'Error al listar los usuarios: %', error_message;
        END;
    ELSE
        RAISE EXCEPTION 'Acción no válida: %', p_action;
    END IF;
END;
$BODY$;

