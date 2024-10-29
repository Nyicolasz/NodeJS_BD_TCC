const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');
const AreaProfi = require('./areaProfi'); // Importando o modelo AreaProfi para uso da FK

const Curso = sequelize.define('Curso', {
    Nome_Curso: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descricao_Curso: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Carga_Horaria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nivel: {
        type: DataTypes.ENUM('Básico', 'Intermediário', 'Avançado'),
        allowNull: false
    },
    ID_AreaProfi: {
        type: DataTypes.INTEGER,
        references: {
            model: AreaProfi, // Nome do modelo com o qual a FK está relacionada
            key: 'ID_AreaProfi' // Nome da chave no modelo relacionado
        }
    },
    Link: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Definindo a associação
Curso.belongsTo(AreaProfi, { foreignKey: 'ID_AreaProfi', as: 'areaProfi' });

module.exports = Curso;
