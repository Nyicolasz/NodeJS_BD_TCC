const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Feedback = require('../models/feedback');
const status = require('http-status');
const nodemailer = require('nodemailer');

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'startjovem.contato@gmail.com',
        pass: 'edyy eakv skfi lqqp' // Certifique-se de que é uma senha de aplicativo válida
    }
});

// Verificação de conexão com o servidor de e-mail
transporter.verify((error, success) => {
    if (error) {
        console.error('Erro ao conectar ao serviço de e-mail:', error);
    } else {
        console.log('Serviço de e-mail pronto para enviar mensagens!');
    }
});

// Cadastro de feedback do usuário
exports.Insert = async (req, res) => {
    const { Nome, Email, Assunto, Mensagem } = req.body;

    try {
        await Feedback.create({
            Nome,
            Email,
            Assunto,
            Mensagem
        });
        res.status(201).json({ message: 'Mensagem registrada com sucesso!' });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao registrar a mensagem. Em caso de persistência, mande um e-mail para "startJovem@sj.com".'
        });
    }
};

// Busca todos os feedbacks
exports.SearchAll = (req, res) => {
    Feedback.findAll()
        .then((feedbacks) => res.status(status.OK).send(feedbacks))
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Busca um feedback por ID
exports.SearchOne = (req, res) => {
    const id = req.params.id;
    Feedback.findByPk(id)
        .then((feedback) => {
            if (feedback) {
                res.status(status.OK).send(feedback);
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.sendFeedback = async (req, res) => {
    const { Nome, Email, Assunto, Mensagem } = req.body;

    try {
        // Envia o e-mail com o feedback
        await transporter.sendMail({
            from: `"${Nome}" <${Email}>`, // Define o nome e o e-mail do usuário como remetente
            to: 'startjovem.contato@gmail.com', // E-mail que receberá as mensagens de feedback
            subject: `Contato de ${Nome} - ${Assunto}`, // Assunto do e-mail
            text: `Nome: ${Nome}\nEmail: ${Email}\nAssunto: ${Assunto}\nMensagem: ${Mensagem}`,
            replyTo: Email // Define o e-mail do usuário como "reply-to" para que respostas sejam enviadas para ele
        });

        res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar mensagem de feedback:', error);
        res.status(500).json({ message: 'Erro ao enviar a mensagem. Tente novamente mais tarde.' });
    }
};
