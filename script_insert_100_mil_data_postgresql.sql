DO $$
DECLARE
    nombres TEXT[] := ARRAY['Mateo', 'Matías', 'Thiago', 'Lucía', 'María', 'Daphne', 'Juan', 'Sofía', 'Alejandro', 'Isabella'];
    nombre TEXT;
BEGIN
    FOR i IN 1..100000 LOOP
        nombre := nombres[((i - 1) / 1000) % array_length(nombres, 1) + 1];
        INSERT INTO users (type_document_id, user_type_id, email, name, document_number)
        VALUES (
            (SELECT id FROM type_document ORDER BY RANDOM() LIMIT 1),
            (SELECT id FROM user_type ORDER BY RANDOM() LIMIT 1),
            LOWER(nombre) || i || '@example.com',
            nombre,
            TO_CHAR(i, 'FM99999999999999999999') -- Genera números de identificación únicos basados en el ID
        );
    END LOOP;
END$$;