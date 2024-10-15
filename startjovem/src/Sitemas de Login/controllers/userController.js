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
            SenhaConfirma: hashedPassword,
            funcao: 'user' // Define o usuário como 'user' por padrão
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
        return res.status(400).json({ message: 'Usuário ou senha errados.' });
    }

    const validPassword = await bcrypt.compare(Senha, user.Senha);
    if (!validPassword) {
        return res.status(400).json({ message: 'Usuário ou senha errados.' });
    }

    // Gera um token (se necessário)
    const token = jwt.sign({ id: user.id, Nome: user.Nome }, 'secreto', { expiresIn: '1h' });

    // Inclui DataNascimento e funcao na resposta
    res.json({ 
        message: 'Login realizado com sucesso!',
        token,
        user: {
            id: user.id,
            Nome: user.Nome,
            Email: user.Email,
            DataNascimento: user.DataNascimento,
            funcao: user.funcao  // Retorna a função do usuário ('admin' ou 'user')
        }
    });
};

// Atualização de perfil
exports.Update = async (req, res, next) => {
    const id = req.params.id;
    const { Nome, Email, DataNascimento, funcao } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Atualiza nome, email, data de nascimento e função (se fornecida)
        await user.update({ Nome, Email, DataNascimento, funcao });
        
        res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar perfil', details: error });
    }
};

// Buscar todos os usuários
exports.SearchAll = (req, res) => {
    User.findAll({
        attributes: ['id', 'Nome', 'Email', 'DataNascimento', 'funcao'] // Inclua o campo funcao
    })
    .then((users) => res.status(status.OK).send(users))
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Buscar um usuário
exports.SearchOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id, {
        attributes: ['id', 'Nome', 'Email', 'DataNascimento', 'funcao'] // Inclua o campo funcao
    })
    .then((user) => {
        if (user) {
            res.status(status.OK).send(user);
        } else {
            res.status(status.NOT_FOUND).send();
        }
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Excluir um usuário
exports.Delete = (req, res) => {
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
