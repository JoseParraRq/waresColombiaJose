export const createUserValidatorSchema = {
    type_document_id: {
        in: ["body"],
        isInt: true,
        notEmpty: true,
        exists: true,
        errorMessage: "El ID del tipo de documento es requerido y debe ser un entero",
    },
    user_type_id: {
        in: ["body"],
        isInt: true,
        notEmpty: true,
        exists: true,
        errorMessage: "El ID del tipo de usuario es requerido y debe ser un entero",
    },
    email: {
        in: ["body"],
        isString: true,
        isEmail: true,
        exists: true,
        errorMessage: "Email es requerido y debe ser valido eje: correo@correo.com",
    },
    name: {
        in: ["body"],
        isString: true,
        exists: true,
        errorMessage: "Name es requerido y debe ser una cadena de texto.",
    },
    document_number: {
        in: ["body"],
        isString: true,
        exists: true,
        errorMessage: "Document number es requerido y debe ser una cadena de texto.",
    },
};

export const updateUserValidatorSchema = {
    id: {
        in: ["params"], // Cambiado a params para el ID en la URL
        isInt: true,
        notEmpty: true,
        exists: true,
        errorMessage: "Debe de indicar un id de usuario valido",
    },
    type_document_id: {
        in: ["body"],
        isInt: true,
        isOptional: true,
        errorMessage: "El ID del tipo de documento es requerido y debe ser un entero",
    },
    user_type_id: {
        in: ["body"],
        isInt: true,
        isOptional: true,
        errorMessage: "El ID del tipo de usuario es requerido y debe ser un entero",
    },
    email: {
        in: ["body"],
        isString: true,
        isEmail: true,
        isOptional: true,
        errorMessage: "Email es requerido y debe ser valido eje: correo@correo.com",
    },
    name: {
        in: ["body"],
        isString: true,
        isOptional: true,
        errorMessage: "Name debe ser una cadena de texto.",
    },
    document_number: {
        in: ["body"],
        isString: true,
        exists: true,
        errorMessage: "Document number es requerido y debe ser una cadena de texto.",
    },
};

export const loginValidatorSchema = {
    email: {
        in: ["body"],
        isString: true,
        isEmail: true,
        exists: true,
        errorMessage: "Email es requerido y debe ser valido eje: correo@correo.com",
    },
};