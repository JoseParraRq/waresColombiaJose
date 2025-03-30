import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión a PostgreSQL establecida');
    client.release();
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error);
  }
};

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
};