const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database');  // Certifique-se de que o caminho está correto

const Login = sequelize.define('Login_User', {
    CPF: {
        type: DataTypes.STRING(11),
        allowNull: false,
        primaryKey: true
    },
    Nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Genero: {
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
    tableName: 'Login_User',
    timestamps: false
});

module.exports = Login;
