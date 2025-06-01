const jwt = require('jsonwebtoken');

// Obtener  el JWT_SECRET de las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar el token JWT
const auth = (req, res, next) => {
  // Obtener el token del encabezado de la solicitud
  const token = req.header('x-auth-token'); // O 'Authorization' si prefieres ese header

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada.' });
  }

  try {
    // Verificar el token
    // jwt.verify() decodifica el token usando el secreto y verifica su validez (firma y expiración).
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adjuntar la información del usuario decodificada al objeto 'req'
    // Esto hace que el id y el role del usuario estén disponibles en las rutas subsiguientes.
    req.user = decoded.user; 
    next(); // Llama a la siguiente función middleware o a la función de la ruta
  } catch (error) {
    // Si el token no es válido, devuelve error 401
    res.status(401).json({ message: 'Token no válido.' });
  }
};

// Middleware para verificar si el usuario tiene el rol de "staff"
const authorizeStaff = (req, res, next) => {
  // Este middleware asume que 'auth' ya se ejecutó y 'req.user' está disponible
  if (!req.user || req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de staff.' });
  }
  next();
};

module.exports = { auth, authorizeStaff }; // Exporta ambos middlewares