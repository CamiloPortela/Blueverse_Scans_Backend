const express = require('express');
const router = express.Router(); // Obtenemos una instancia del router de Express
const Manga = require('../models/Manga'); // Importamos el modelo de Manga que creamos
const { auth, authorizeStaff } = require('../middleware/authMiddleware'); // <-- Importa los middlewares

// --- RUTA 1: Obtener todos los mangas/cómics ---
// GET /api/mangas
router.get('/', async (req, res) => {
  try {
    // Busca todos los mangas en la base de datos
    const mangas = await Manga.find({});
    res.status(200).json(mangas); 
  } catch (error) {
    // Si ocurre un error, envía un mensaje de error y un estado 500 
    res.status(500).json({ message: 'Error al obtener los mangas', error: error.message });
  }
});

// --- RUTA 2: Obtener un manga/cómic específico por ID ---
// GET /api/mangas/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del manga desde los parámetros de la URL
    // Busca un manga por su ID
    const manga = await Manga.findById(id);

    if (!manga) {
      // Si no se encuentra el manga, devuelve un estado 404 
      return res.status(404).json({ message: 'Manga no encontrado' });
    }

    res.status(200).json(manga); // Devuelve el manga encontrado
  } catch (error) {
    // Si el ID no es válido o hay otro error, envía un error
    res.status(500).json({ message: 'Error al obtener el manga', error: error.message });
  }
});

// --- RUTA 3: Obtener un capítulo específico de un manga/cómic por ID de Manga y número de Capítulo ---
// GET /api/mangas/:mangaId/capitulos/:numeroCapitulo
router.get('/:mangaId/capitulos/:numeroCapitulo', async (req, res) => {
  try {
    const { mangaId, numeroCapitulo } = req.params; // Obtenner el ID del manga y el número de capítulo

    const manga = await Manga.findById(mangaId); // Buscar el manga por su ID

    if (!manga) {
      return res.status(404).json({ message: 'Manga no encontrado' });
    }

    // Buscar el capítulo específico dentro del array de capítulos del manga
    const capitulo = manga.capitulos.find(
      (c) => c.numero === parseInt(numeroCapitulo) // 
    );

    if (!capitulo) {
      return res.status(404).json({ message: 'Capítulo no encontrado para este manga' });
    }

    res.status(200).json(capitulo); // Devuelve el capítulo encontrado
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el capítulo', error: error.message });
  }
});

// --- RUTA STAFF: Crear un nuevo manga/cómic (PROTEGIDA POR STAFF) ---
// POST /api/mangas
router.post('/', auth, authorizeStaff, async (req, res) => {
  try {
    const nuevoManga = new Manga(req.body);
    const mangaGuardado = await nuevoManga.save();
    res.status(201).json(mangaGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el manga', error: error.message });
  }
});

// --- RUTA 4: Actualizar un manga/cómic existente por ID (PUT) ---
// PUT /api/mangas/:id
router.put('/:id', auth, authorizeStaff, async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del manga desde los parámetros de la URL
    const { capitulos } = req.body; // Obtener el array de capítulos actualizado

    // Busca el manga por su ID
    const manga = await Manga.findById(id);

    if (!manga) {
      // Si no se encuentra el manga, devuelve un estado 404
      return res.status(404).json({ message: 'Manga no encontrado' });
    }

    // Actualiza el array de capítulos del manga
    manga.capitulos = capitulos;

    // Guarda los cambios en la base de datos
    const mangaActualizado = await manga.save();

    res.status(200).json(mangaActualizado); // Devuelve el manga actualizado
  } catch (error) {
    // Si hay un error, envía un mensaje de error
    res.status(400).json({ message: 'Error al actualizar el manga', error: error.message });
  }
});

// --- RUTA 5: Eliminar un manga/cómic por ID (DELETE) ---
// DELETE /api/mangas/:id
router.delete('/:id', auth, authorizeStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const mangaEliminado = await Manga.findByIdAndDelete(id);

    if (!mangaEliminado) {
      return res.status(404).json({ message: 'Manga no encontrado para eliminar' });
    }
    res.status(200).json({ message: 'Manga eliminado correctamente', manga: mangaEliminado });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el manga', error: error.message });
  }
});

module.exports = router; // Exportar el router