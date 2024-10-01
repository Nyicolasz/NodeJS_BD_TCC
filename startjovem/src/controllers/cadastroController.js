const Cadastro = require('../models/cadastro');
const status = require('http-status');

exports.Insert = (req, res, next) => {
    const { Nome, Email, DataNascimento, Senha, SenhaConfirma } = req.body;
    Cadastro.create({
        Nome: Nome,
        Email: Email,
        DataNascimento: DataNascimento,
        Senha: Senha,
        SenhaConfirma: SenhaConfirma
    })
        .then((cadastro) => res.status(status.CREATED).send(cadastro))
        .catch((error) => res.status(status.BAD_REQUEST).json({ error: error.message }));
};

exports.SearchAll = (req, res, next) => {
    Cadastro.findAll()
        .then((cadastros) => res.status(status.OK).send(cadastros))
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.SearchOne = (req, res, next) => {
    const id = req.params.id;
    Cadastro.findByPk(id)
        .then((cadastro) => {
            if (cadastro) {
                res.status(status.OK).send(cadastro);
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.Update = (req, res, next) => {
    const id = req.params.id;
    const { Nome, Email, DataNascimento, Senha, SenhaConfirma } = req.body;
    Cadastro.findByPk(id)
        .then((cadastro) => {
            if (cadastro) {
                cadastro.update({
                    Nome: Nome,
                    Email: Email,
                    DataNascimento: DataNascimento,
                    Senha: Senha,
                    SenhaConfirma: SenhaConfirma
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
    Cadastro.findByPk(id)
        .then((cadastro) => {
            if (cadastro) {
                cadastro.destroy()
                    .then(() => res.status(status.OK).send())
                    .catch((error) => res.status(status.BAD_REQUEST).json({ error: error.message }));
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};
