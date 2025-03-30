import express from 'express';
import userTypesRoutes from './routes/userType.routes.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use(userTypesRoutes); // Prefijo para rutas de tipos de usuario
app.use(userRoutes); // Prefijo para rutas de usuarios

// Manejo de errores global (opcional, pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log del error en la consola
    res.status(500).send('Algo salió mal!'); // Respuesta genérica al cliente
});

export default app;