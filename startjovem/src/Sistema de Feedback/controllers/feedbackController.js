const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Feedback = require('../models/feedback');
const status = require('http-status');


// Cadastro de usuário
exports.Insert = async (req, res) => {
    const { Nome, Email, Assunto, Mensagem } = req.body;

    try {
        const newFeedback = await Feedback.create({
            Nome,
            Email,
            Assunto,
            Mensagem
        });
        res.status(400).json({ message: 'Mensagem registrada com sucesso!' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro ao registrar a mensagem, verifique todos os campos. Em caso de persistencia mande um e-mail para "startJovem@sj.com".' 
        });
    }
};

exports.SearchAll = (req, res, next) => {
    Feedback.findAll()
    .then((feedbacks) => res.status(status.OK).send(feedbacks))
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.SearchOne = (req, res, next) => {
    const id = req.params.id;
    Feedback.findByPk(id)
    .then((feedbacks) => {
        if (feedbacks) {
            res.status(status.OK).send(feedbacks);
        } else {
            res.status(status.NOT_FOUND).send();
        }
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

