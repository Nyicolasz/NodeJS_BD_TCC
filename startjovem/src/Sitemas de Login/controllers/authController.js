const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
