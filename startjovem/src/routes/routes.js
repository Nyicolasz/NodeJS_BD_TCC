const express = require('express');

const multer = require('multer');
const path = require('path');



const SistemaLogin = require('../Sitemas de Login/controllers/userController');
const SistemaFeedback = require('../Sistema de Feedback/controllers/feedbackController');
const areaProfiController = require('../Sistema de Cursos/controllers/areaProfiController');
const cursoController = require('../Sistema de Cursos/controllers/cursoController');
const TrilhaController = require('../Sistema de Trilhas/controllers/trilhaController');

const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');




const router = express.Router();


router.post('/login_users', SistemaLogin.login);
router.post('/users', SistemaLogin.register);
router.put('/users/:id', SistemaLogin.Update);
router.get('/users', SistemaLogin.SearchAll);
router.get('/users/:id', SistemaLogin.SearchOne);
router.delete('/users/:id', SistemaLogin.Delete);


// Rota privada para administradores
router.get('/Perfil_Admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.json({ message: 'Bem-vindo à área administrativa!' });
});




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

router.post('/send-feedback', SistemaFeedback.sendFeedback);


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
router.delete('/trilhas/:userId/:cursoId', TrilhaController.Delete);


// Rotas para envio e verificação de código de e-mail
router.post('/send-verification-code', SistemaLogin.sendVerificationCode);
router.post('/verify-code', SistemaLogin.verifyCode);

// Rota para enviar o código de recuperação de senha
router.post('/send-password-reset-code', SistemaLogin.sendPasswordResetCode);

// Rota para verificar o código de recuperação e redefinir a senha
router.post('/verify-password-reset-code', SistemaLogin.verifyPasswordResetCode);


module.exports = router;
