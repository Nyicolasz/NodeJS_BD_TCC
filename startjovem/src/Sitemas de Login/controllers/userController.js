const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');
const status = require('http-status');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const VerificationCode = require('../models/VerificationCode'); // Modelo para armazenar códigos temporários
const { Op } = require('sequelize');

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

    // Inclui DataNascimento, funcao e ImagemPerfil na resposta
    res.json({
        message: 'Login realizado com sucesso!',
        token,
        user: {
            id: user.id,
            Nome: user.Nome,
            Email: user.Email,
            DataNascimento: user.DataNascimento,
            funcao: user.funcao,
            ImagemPerfil: user.ImagemPerfil // Inclua a URL da imagem de perfil
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
        attributes: ['id', 'Nome', 'Email', 'DataNascimento', 'funcao', 'ImagemPerfil'] // Inclua o campo ImagemPerfil
    })
        .then((users) => res.status(status.OK).send(users))
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Buscar um usuário
exports.SearchOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id, {
        attributes: ['id', 'Nome', 'Email', 'DataNascimento', 'funcao', 'ImagemPerfil'] // Inclua o campo ImagemPerfil
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

// Função para fazer o upload da imagem de perfil
exports.uploadProfileImage = async (req, res) => {
    const id = req.params.id;
    let imagePath = req.file ? path.join('/uploads', req.file.filename) : null;

    // Substituir barras invertidas por barras normais para garantir a compatibilidade
    imagePath = imagePath.replace(/\\/g, '/');

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

        // Atualiza o campo ImagemPerfil com o caminho da imagem
        await user.update({ ImagemPerfil: imagePath });
        res.status(200).json({ message: "Imagem de perfil atualizada com sucesso.", imagePath });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar imagem.", error });
    }
};

// Função para remover a imagem de perfil
exports.removeProfileImage = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Verifica se há uma imagem associada e remove o arquivo do servidor
        if (user.ImagemPerfil) {
            const imagePath = path.join(__dirname, '..', user.ImagemPerfil);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Erro ao remover o arquivo:", err);
                }
            });
        }

        // Atualiza o campo `ImagemPerfil` para `null` no banco de dados
        await user.update({ ImagemPerfil: null });
        res.status(200).json({ message: "Imagem de perfil removida com sucesso." });
    } catch (error) {
        console.error("Erro ao remover imagem de perfil:", error);
        res.status(500).json({ message: "Erro ao remover imagem de perfil.", error });
    }
};

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'startjovem.contato@gmail.com',
        pass: 'ljdx pywq tovs nqvh'
    }
});

// Função para enviar o código de verificação
exports.sendVerificationCode = async (req, res) => {
    const { Email } = req.body;

    // Gera um código de verificação
    const verificationCode = crypto.randomInt(100000, 999999); // Código de 6 dígitos

    // Salva o código no banco de dados com o e-mail e expiração
    await VerificationCode.create({ email: Email, code: verificationCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    // Envia o e-mail
    try {
        await transporter.sendMail({
            from: 'seuemail@gmail.com',
            to: Email,
            subject: 'Código de Verificação',
            text: `Seu código de verificação é: ${verificationCode}`
        });

        res.status(200).json({ message: 'Código de verificação enviado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar o e-mail de verificação.' });
    }
};

// Função para verificar o código
exports.verifyCode = async (req, res) => {
    const { Email, code } = req.body;

    try {
        // Procura o código no banco de dados com o e-mail correspondente e não expirado
        const verification = await VerificationCode.findOne({
            where: {
                email: Email,
                code: code,
                expiresAt: {
                    [Op.gt]: new Date() // Garante que o código ainda está válido
                }
            }
        });

        if (!verification) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        // Se o código for válido, você pode deletá-lo do banco de dados (opcional)
        await verification.destroy();

        res.status(200).json({ message: 'E-mail verificado com sucesso!' });
    } catch (error) {
        console.error("Erro ao verificar o código:", error);
        res.status(500).json({ message: 'Erro ao verificar o código.' });
    }
};

// Função para enviar o código de recuperação de senha
exports.sendPasswordResetCode = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ message: 'E-mail não encontrado.' });
    }

    const code = crypto.randomInt(100000, 999999).toString(); // Gera um código de 6 dígitos

    await VerificationCode.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }); // Expira em 10 minutos

    try {
        await transporter.sendMail({
            from: 'startjovem.contato@gmail.com', // Certifique-se de que este e-mail seja o mesmo usado na configuração do transporter
            to: email,
            subject: 'Código de Recuperação de Senha',
            text: `Seu código de recuperação de senha é: ${code}`
        });

        res.status(200).json({ message: 'Código de recuperação enviado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar o e-mail de recuperação.' });
    }
};

exports.verifyPasswordResetCode = async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        // Procura o código de verificação válido
        const verification = await VerificationCode.findOne({
            where: {
                email,
                code,
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!verification) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        // Redefine a senha do usuário
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.update({ Senha: hashedPassword }, { where: { email } });
        await verification.destroy(); // Remove o código de verificação após o uso

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error("Erro ao redefinir a senha:", error);
        res.status(500).json({ message: 'Erro ao redefinir a senha. Tente novamente mais tarde.' });
    }
};



