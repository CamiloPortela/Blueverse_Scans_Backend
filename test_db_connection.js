require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definido en .env');
  process.exit(1);
}

console.log('Intentando conectar a MongoDB Atlas...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas exitosamente.');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err);
    console.error('Asegúrate de que tu IP esté permitida en Network Access de Atlas y que tu cadena de conexión sea correcta.');
    mongoose.connection.close();
  });