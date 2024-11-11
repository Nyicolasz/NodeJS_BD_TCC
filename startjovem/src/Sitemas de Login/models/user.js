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
    funcao: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',  // Por padrão, o usuário será 'user'
    },

    ImagemPerfil: {
        type: DataTypes.STRING // Campo para o caminho da imagem
    },
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
