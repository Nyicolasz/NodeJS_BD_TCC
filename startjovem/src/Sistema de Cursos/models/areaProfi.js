const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const AreaProfi = sequelize.define('AreaProfi', {
    ID_AreaProfi: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Nome_Area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descricao_Area: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = AreaProfi;
