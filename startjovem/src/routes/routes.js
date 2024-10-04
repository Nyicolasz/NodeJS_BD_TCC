const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const LoginController = require('../controllers/loginController');
const CadastroController = require('../controllers/cadastroController');

const SistemaLogin = require('../Sitemas de Login/controllers/authController');

const router = express.Router();

// Rotas para usuários
router.post('/usuarios', UsuarioController.Insert);
router.get('/usuarios', UsuarioController.SearchAll);
router.get('/usuarios/:id', UsuarioController.SearchOne);
router.put('/usuarios/:id', UsuarioController.Update);
router.delete('/usuarios/:id', UsuarioController.Delete);

// Rotas para login
router.post('/login', LoginController.Insert);
router.get('/login', LoginController.SearchAll);
router.get('/login/:id', LoginController.SearchOne);
router.put('/login/:id', LoginController.Update);
router.delete('/login/:id', LoginController.Delete);

router.post('/cadastros', CadastroController.Insert);
router.get('/cadastros', CadastroController.SearchAll);


router.post('/users', SistemaLogin.register);
router.post('/login_users', SistemaLogin.login);





module.exports = router;
