const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Importa bcryptjs para hashear contraseñas
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para crear tokens
const User = require('../models/User'); // Importa el modelo de usuario

// Secreto para firmar los JWT: WCacPmeEMf2bm40SKWBi72ZGjNRzHD
// Por ahora, lo pondremos aquí, pero lo moveremos al .env pronto.
const JWT_SECRET = process.env.JWT_SECRET || 'secreto';
                                                                     // Lo obtendremos del .env

// --- RUTA 1: Registro de nuevo usuario ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Obtiene los datos del cuerpo de la solicitud

    // Valida si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario con este email ya existe.' });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    // Hashear contraseña
    // Genera un 'salt' (cadena aleatoria) y hashea la contraseña.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea el nuevo usuario
    user = new User({
      username,
      email,
      password: hashedPassword, // Guarda la contraseña hasheada
      role: role || 'user' // Por defecto es user
    });

    await user.save(); // Guarda el usuario en la base de datos

    // Genera un token JWT 
    const payload = {
      user: {
        id: user.id, // ID del usuario
        role: user.role // Rol del usuario
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // El token expirará en 1 hora
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ message: 'Usuario registrado exitosamente', token }); // Devuelve el token
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error en el servidor al registrar el usuario', error: error.message });
  }
});

// --- RUTA 2: Inicio de Sesión de usuario ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas (email o contraseña incorrectos).' });
    }

    // Compara la contraseña proporcionada con la contraseña hasheada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas (email o contraseña incorrectos).' });
    }

    // Genera un token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // El token expira en 1 hora
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ message: 'Inicio de sesión exitoso', token }); // Devuelve el token
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
  }
});

module.exports = router;