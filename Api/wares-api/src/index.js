import app from './app.js';
import { connectDB } from './database/database.js';

async function main() {
  try {
    await connectDB(); // Intenta conectar a la base de datos
    console.log('Conexión a la base de datos establecida correctamente.');
    app.listen(3000, () => {
      console.log('Servidor escuchando en el puerto 3000');
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

main();