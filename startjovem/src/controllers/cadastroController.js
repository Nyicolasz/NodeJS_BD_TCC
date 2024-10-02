const bcrypt = require('bcrypt'); // Importa o bcrypt para criptografar a senha
const Cadastro = require('../models/cadastro');
const status = require('http-status');

// Função para criar um novo cadastro
exports.Insert = async (req, res, next) => {
    const { Nome, Email, DataNascimento, Senha, SenhaConfirma } = req.body;

    // Verifica se as senhas são iguais
    if (Senha !== SenhaConfirma) {
        return res.status(status.BAD_REQUEST).json({ error: 'As senhas não coincidem' });
    }

    try {
        // Gera o hash da senha (bcrypt.hash) antes de salvar no banco de dados
        const saltRounds = 10; // Número de rounds para gerar o salt, pode ajustar conforme necessidade
        const hashedPassword = await bcrypt.hash(Senha, saltRounds); // Cria o hash da senha
        const hashedPasswordConfirm = await bcrypt.hash(SenhaConfirma, saltRounds); // Criptografa a senha de confirmação

        // Cria o cadastro no banco de dados com a senha criptografada
        const cadastro = await Cadastro.create({
            Nome: Nome,
            Email: Email,
            DataNascimento: DataNascimento,
            Senha: hashedPassword,           // Armazena a senha criptografada
            SenhaConfirma: hashedPasswordConfirm // Armazena a senha de confirmação criptografada (não recomendado)
        });

        // Envia o cadastro criado como resposta
        res.status(status.CREATED).send(cadastro);
    } catch (error) {
        res.status(status.BAD_REQUEST).json({ error: error.message });
    }
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
