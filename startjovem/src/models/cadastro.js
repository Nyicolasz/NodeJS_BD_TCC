const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // Caminho correto para o seu arquivo de configuração

const Cadastro = sequelize.define('Cadastro', {
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SenhaConfirma: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Cadastro',
    timestamps: false
});

module.exports = Cadastro;
