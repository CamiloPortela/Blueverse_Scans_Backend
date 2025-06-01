require('dotenv').config(); // Carga las variables de entorno del archivo .env
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS DE LA CARPETA 'UPLOADS' ---
// Esto hace que cualquier archivo en 'uploads' sea accesible a través de /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// --- FIN SERVIR ARCHIVOS ESTÁTICOS ---

// --- IMPORTA Y USA LAS RUTAS DE AUTENTICACIÓN ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// --- FIN RUTAS DE AUTENTICACIÓN ---

// --- IMPORTA Y USA LAS RUTAS DE USUARIO ---
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// --- FIN RUTAS DE USUARIO ---

// --- IMPORTA Y USA LAS RUTAS DE MANGA ---
const mangaRoutes = require('./routes/mangaRoutes');
app.use('/api/mangas', mangaRoutes);
// --- FIN RUTAS DE MANGA ---

// Define una ruta básica para probar que el servidor funciona
app.get('/', (req, res) => {
  res.send('¡Hola desde el backend de Blueverse Scan!');
});

// --- CONEXIÓN A MONGODB ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));
// --- FIN CONEXIÓN A MONGODB ---

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor de Blueverse Scan ejecutándose en http://localhost:${PORT}`);
});