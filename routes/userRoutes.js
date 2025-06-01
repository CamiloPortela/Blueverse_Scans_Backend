const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa el modelo de usuario
const { auth } = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

// --- RUTA 1: Obtener el progreso de lectura del usuario autenticado ---
// GET /api/users/progress
router.get('/progress', auth, async (req, res) => { // Protegida por el middleware 'auth'
  try {
    // El ID del usuario se obtiene de req.user.id gracias al middleware auth
    const user = await User.findById(req.user.id).select('progreso_lectura'); 

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user.progreso_lectura); // Devuelve el array de progreso de lectura
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error en el servidor al obtener el progreso de lectura', error: error.message });
  }
});

// --- RUTA 2: Guardar o actualizar el progreso de lectura para un manga específico ---
// POST /api/users/progress
router.post('/progress', auth, async (req, res) => { 
  try {
    const { manga_id, ultimo_capitulo_leido } = req.body;

    // Validaciones básicas
    if (!manga_id || typeof ultimo_capitulo_leido === 'undefined') {
      return res.status(400).json({ message: 'Faltan campos requeridos: manga_id o ultimo_capitulo_leido.' });
    }

    const user = await User.findById(req.user.id); // Busca el usuario por su ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Busca si ya existe un registro de progreso para este manga
    let progresoExistente = user.progreso_lectura.find(
      p => p.manga_id.toString() === manga_id
    );

    if (progresoExistente) {
      // Si el progreso existe, lo actualiza solo si el nuevo capítulo es mayor o igual
      if (ultimo_capitulo_leido >= progresoExistente.ultimo_capitulo_leido) {
        progresoExistente.ultimo_capitulo_leido = ultimo_capitulo_leido;
        progresoExistente.fecha_ultima_lectura = Date.now();
      } else {
        // Si el nuevo capítulo es menor, no se actualiza y se puede devolver un mensaje
        return res.status(200).json({ message: 'Progreso no actualizado, el capítulo proporcionado es anterior o igual al último guardado.', progreso: progresoExistente });
      }
    } else {
      // Si no existe, añade un nuevo registro de progreso
      user.progreso_lectura.push({
        manga_id,
        ultimo_capitulo_leido,
        fecha_ultima_lectura: Date.now()
      });
    }

    await user.save(); // Guarda los cambios en el usuario

    res.status(200).json({ message: 'Progreso de lectura guardado/actualizado exitosamente.', progreso: user.progreso_lectura });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error en el servidor al guardar el progreso de lectura', error: error.message });
  }
});

module.exports = router;