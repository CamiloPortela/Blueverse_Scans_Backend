const mongoose = require('mongoose');

// Esquema para un capítulo individual
const chapterSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true
  },
  titulo_capitulo: {
    type: String,
    required: true
  },
  // contenido_url: almacenar una URL a donde se encuentre el contenido del capítulo
  contenido_urls: [String] // Array de URLs de imágenes para las páginas del capítulo
});

// Esquema principal para el Manga/Cómic
const mangaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    unique: true // Asegura que no haya dos mangas con el mismo título
  },
  autor: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  portada_url: { // es una URL
    type: String
  },
  generos: [String], 
  estado: { 
    type: String,
    enum: ['En publicación', 'Finalizado', 'Pausado', 'Próximamente', 'Desconocido'], // Valores permitidos
    default: 'En publicación'
  },
  // Array de subdocumentos para los capítulos
  // Los capítulos se almacenarán directamente dentro del documento del manga
  capitulos: [chapterSchema]
}, {
  timestamps: true // Añade automáticamente `createdAt` y `updatedAt`
});

// Crea el modelo a partir del esquema
const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga; // Exporta el modelo