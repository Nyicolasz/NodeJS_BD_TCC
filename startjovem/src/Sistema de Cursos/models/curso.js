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
    QuantidadeAulas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Valor inicial padrão
    },

});

// Definindo a associação com exclusão em cascata
Curso.belongsTo(AreaProfi, {
    foreignKey: 'ID_AreaProfi',
    as: 'areaProfi',
    onDelete: 'CASCADE', // Exclusão em cascata
});

// Também definimos a associação reversa
AreaProfi.hasMany(Curso, {
    foreignKey: 'ID_AreaProfi',
    as: 'cursos',
    onDelete: 'CASCADE', // Exclusão em cascata
});

module.exports = Curso;
