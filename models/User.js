const mongoose = require('mongoose');

// Esquema para el progreso de lectura de un usuario en un manga específico
const progresoLecturaSchema = new mongoose.Schema({
  manga_id: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del manga
    ref: 'Manga',
    required: true
  },
  ultimo_capitulo_leido: {
    type: Number,
    default: 0 // Si no ha leído nada, empieza en 0
  },
  fecha_ultima_lectura: {
    type: Date,
    default: Date.now // Fecha y hora de la última actualización
  }
});

// Esquema principal para el Usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // El nombre de usuario debe ser único
    trim: true // Elimina espacios en blanco al inicio y al final
  },
  email: {
    type: String,
    required: true,
    unique: true, // El email debe ser único
    trim: true,
    lowercase: true, // Guarda el email en minúsculas
    match: [/.+@.+\..+/, 'Por favor, introduce un email válido'] // Validación de formato de email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'staff'], // Solo permite estos dos roles
    default: 'user' // Por defecto, un nuevo usuario es 'user'
  },
  progreso_lectura: [progresoLecturaSchema]
}, {
  timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
});

// Crea el modelo a partir del esquema
const User = mongoose.model('User', userSchema);

module.exports = User; // Exporta el modelo