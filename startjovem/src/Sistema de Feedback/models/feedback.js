const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const Feedback = sequelize.define('Feedback', {
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Mensagem: {
        type: DataTypes.STRING (1500),
        allowNull: false,
    }
}, {
    tableName: 'feedback',
    timestamps: false
});

module.exports = Feedback;
