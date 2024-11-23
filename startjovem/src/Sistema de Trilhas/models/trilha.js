const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');
const User = require('../../Sitemas de Login/models/user'); // Importando o modelo user para uso da FK
const Curso = require('../../Sistema de Cursos/models/curso'); // Importando o modelo curso para uso da FK

const Trilha = sequelize.define('Trilha', {
    ID_User: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Modelo com a chave primária 'id'
            key: 'id' // Chave primária na tabela relacionada
        }
    },
    ID_Curso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Curso, // Modelo com a chave primária 'id'
            key: 'id' // Chave primária na tabela relacionada
        }
    },
    Progresso: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    indexes: [
        {
            unique: true, // Define a restrição de unicidade
            fields: ['ID_User', 'ID_Curso'] // Combinação única
        }
    ]
});

// Definindo a associação com o User e Curso
Trilha.belongsTo(User, { foreignKey: 'ID_User', as: 'user' });
Trilha.belongsTo(Curso, { foreignKey: 'ID_Curso', as: 'curso' });

module.exports = Trilha;
