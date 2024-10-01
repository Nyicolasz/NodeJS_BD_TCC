const Login_User = require('../models/login');
const status = require('http-status');

exports.Insert = (req, res, next) => {
    const { CPF, Nome, Email, Senha, Idade, Genero } = req.body;
    Login_User.create({
        CPF: CPF,
        Nome: Nome,
        Email: Email,
        Senha: Senha,
        Idade: Idade,
        Genero: Genero
    })
    .then((login) => res.status(status.CREATED).send(login))
    .catch((error) => res.status(status.BAD_REQUEST).json({ error: error.message }));
};

exports.SearchAll = (req, res, next) => {
    Login_User.findAll()
    .then((logins) => res.status(status.OK).send(logins))
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.SearchOne = (req, res, next) => {
    const id = req.params.id;
    Login_User.findByPk(id)
    .then((login) => {
        if (login) {
            res.status(status.OK).send(login);
        } else {
            res.status(status.NOT_FOUND).send();
        }
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.Update = (req, res, next) => {
    const id = req.params.id;
    const { CPF, Nome, Email, Senha, Idade, Genero } = req.body;
    Login_User.findByPk(id)
    .then((login) => {
        if (login) {
            login.update({
                CPF: CPF,
                Nome: Nome,
                Email: Email,
                Senha: Senha,
                Idade: Idade,
                Genero: Genero
            })
            .then(() => res.status(status.OK).send())
            .catch((error) => res.status(status.BAD_REQUEST).json({ error: error.message }));
        } else {
            res.status(status.NOT_FOUND).send();
        }
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.Delete = (req, res, next) => {
    const id = req.params.id;
    Login_User.findByPk(id)
    .then((login) => {
        if (login) {
            login.destroy()
            .then(() => res.status(status.OK).send())
            .catch((error) => res.status(status.BAD_REQUEST).json({ error: error.message }));
        } else {
            res.status(status.NOT_FOUND).send();
        }
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};
