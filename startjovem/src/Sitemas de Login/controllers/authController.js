const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const status = require('http-status');


// Cadastro de usuário
exports.register = async (req, res) => {
    const { Nome, Email, DataNascimento, Senha, SenhaConfirma } = req.body;

    if (Senha !== SenhaConfirma) {
        return res.status(400).json({ message: 'As senhas não coincidem!' });
    }

    const userExist = await User.findOne({ where: { Email } });
    if (userExist) {
        return res.status(400).json({ message: 'Email já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Senha, salt);

    try {
        const newUser = await User.create({
            Nome,
            Email,
            DataNascimento,
            Senha: hashedPassword,
            SenhaConfirma: hashedPassword
        });
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar o usuário.' });
    }
};




// Login de usuário
exports.login = async (req, res) => {
    const { Email, Senha } = req.body;

    const user = await User.findOne({ where: { Email } });
    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const validPassword = await bcrypt.compare(Senha, user.Senha);
    if (!validPassword) {
        return res.status(400).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user.id, Nome: user.Nome }, 'secreto', { expiresIn: '1h' });
    res.json({ message: 'Login realizado com sucesso!', token, user });
};

exports.SearchAll = (req, res, next) => {
    User.findAll()
    .then((users) => res.status(status.OK).send(users))
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.SearchOne = (req, res, next) => {
    const id = req.params.id;
    User.findByPk(id)
    .then((users) => {
        if (users) {
            res.status(status.OK).send(users);
        } else {
            res.status(status.NOT_FOUND).send();
        }
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

exports.Update = async (req, res, next) => {
    const id = req.params.id;
    const { Nome, Email, DataNascimento, Senha } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Se a senha for fornecida, atualize-a
        if (Senha) {
            const hashedPassword = await bcrypt.hash(Senha, 10);
            await user.update({ Nome, Email, DataNascimento, Senha: hashedPassword });
        } else {
            await user.update({ Nome, Email, DataNascimento });
        }

        res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar perfil', details: error });
    }
};



exports.Delete = (req, res, next) => {
    const id = req.params.id;
    User.findByPk(id)
        .then((user) => {
            if (user) {
                user.destroy()
                    .then(() => res.status(status.OK).send())
                    .catch((error) => res.status(status.BAD_REQUEST).json({ error: error.message }));
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

