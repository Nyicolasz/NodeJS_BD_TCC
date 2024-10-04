const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const User = sequelize.define('User', {
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    tableName: 'users',
    timestamps: false
});

module.exports = User;
