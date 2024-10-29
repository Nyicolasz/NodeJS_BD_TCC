const Trilha = require('../models/trilha');
const status = require('http-status');
const User = require('../../Sitemas de Login/models/user'); // Importando o modelo user para uso da FK
const Curso = require('../../Sistema de Cursos/models/curso'); // Importando o modelo curso para uso da FK

// Inserir um novo trilha
exports.Insert = async (req, res) => {
    const { ID_User, ID_Curso } = req.body;

    try {
        const newTrilha = await Trilha.create({
            ID_User,
            ID_Curso,
        });
        res.status(status.CREATED).json({ message: 'Trilha criado com sucesso!', newTrilha });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao registrar a trilha.',
            error: error.message
        });
    }
};

// Buscar todas as trilhas
exports.SearchAll = async (req, res) => {
    try {
        const trilhas = await Trilha.findAll({
            order: [['id', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',  // Usar o alias definido na associação
                    attributes: ['Nome']  // Defina os campos que deseja incluir
                },
                {
                    model: Curso,
                    as: 'curso',  // Usar o alias definido na associação
                    attributes: ['Nome_Curso']  // Defina os campos que deseja incluir
                }
            ]
        });
        res.status(200).send(trilhas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar uma trilha específica pelo ID
exports.SearchOne = (req, res) => {
    const id = req.params.id;
    Trilha.findByPk(id, {
        include: ['user', 'curso']  // Inclui os dados da tabela de áreas profissionais
    })
        .then((trilha) => {
            if (trilha) {
                res.status(status.OK).send(trilha);
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Buscar todas as trilhas de um usuário específico pelo ID do usuário
exports.SearchByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const trilhas = await Trilha.findAll({
            where: { ID_User: userId },
            include: [
                {
                    model: Curso,
                    as: 'curso',  // Usar o alias definido na associação
                    attributes: ['id', 'Nome_Curso', 'Link']  // Campos específicos do curso
                }
            ]
        });
        res.status(200).json(trilhas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
