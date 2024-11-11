const jwt = require('jsonwebtoken');

// Middleware de autenticação: verifica se o usuário está autenticado
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

// Middleware de autorização: verifica se o usuário é administrador
function authorizeAdmin(req, res, next) {
  if (req.user.funcao !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
  }
  next();
}

module.exports = { authenticateToken, authorizeAdmin };
