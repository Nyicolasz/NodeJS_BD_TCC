const express = require('express');

const multer = require('multer');
const path = require('path');

const UsuarioController = require('../controllers/usuarioController');
const LoginController = require('../controllers/loginController');
const CadastroController = require('../controllers/cadastroController');

const SistemaLogin = require('../Sitemas de Login/controllers/userController');
const SistemaFeedback = require('../Sistema de Feedback/controllers/feedbackController');
const areaProfiController = require('../Sistema de Cursos/controllers/areaProfiController');
const cursoController = require('../Sistema de Cursos/controllers/cursoController');
const TrilhaController = require('../Sistema de Trilhas/controllers/trilhaController');



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



// Configuração do multer para armazenar a imagem localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Pasta onde a imagem será salva
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nome único para a imagem
    }
});

const upload = multer({ storage });

// Rota para o upload da imagem de perfil
router.put('/users/:id/upload', upload.single('imagemPerfil'), SistemaLogin.uploadProfileImage);
// Rota para remover a imagem de perfil
router.put('/users/:id/remove-image', SistemaLogin.removeProfileImage);



router.post('/feedback', SistemaFeedback.Insert);
router.get('/feedback', SistemaFeedback.SearchAll);
router.get('/feedback/:id', SistemaFeedback.SearchOne);

router.post('/AreaProfi', areaProfiController.Insert);
router.get('/AreaProfi', areaProfiController.SearchAll);
router.get('/AreaProfi/:id', areaProfiController.SearchOne);
router.put('/AreaProfi/:id', areaProfiController.Update);
router.delete('/AreaProfi/:id', areaProfiController.Delete);

router.post('/Curso', cursoController.Insert);
router.get('/Curso', cursoController.SearchAll);
router.get('/Curso/:id', cursoController.SearchOne);
router.put('/Curso/:id', cursoController.Update);
router.delete('/Curso/:id', cursoController.Delete);

router.post('/Trilhas', TrilhaController.Insert);
router.get('/Trilhas', TrilhaController.SearchAll);
router.get('/Trilhas/:id', TrilhaController.SearchOne);
router.get('/trilhas/user/:userId', TrilhaController.SearchByUser); // Nova rota para buscar trilhas pelo ID do usuário
router.put('/trilhas/:userId/:cursoId/progresso', TrilhaController.UpdateProgress);




module.exports = router;
