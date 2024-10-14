const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const LoginController = require('../controllers/loginController');
const CadastroController = require('../controllers/cadastroController');

const SistemaLogin = require('../Sitemas de Login/controllers/userController');
const SistemaFeedback = require('../Sistema de Feedback/controllers/feedbackController');


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





router.post('/login_users', SistemaLogin.login);
router.post('/users', SistemaLogin.register);
router.put('/users/:id', SistemaLogin.Update);
router.get('/users', SistemaLogin.SearchAll);
router.get('/users/:id', SistemaLogin.SearchOne);
router.delete('/users/:id', SistemaLogin.Delete);

router.post('/feedback', SistemaFeedback.Insert);
router.get('/feedback', SistemaFeedback.SearchAll);
router.get('/feedback/:id', SistemaFeedback.SearchOne);






module.exports = router;
