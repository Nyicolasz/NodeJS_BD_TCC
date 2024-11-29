const Trilha = require('../models/trilha');
const status = require('http-status');
const User = require('../../Sitemas de Login/models/user'); // Importando o modelo user para uso da FK
const Curso = require('../../Sistema de Cursos/models/curso'); // Importando o modelo curso para uso da FK

// Inserir um novo trilha
exports.Insert = async (req, res) => {
    const { ID_User, ID_Curso } = req.body;

    try {
        // Verifica se já existe uma trilha com a mesma combinação
        const existingTrilha = await Trilha.findOne({
            where: {
                ID_User,
                ID_Curso,
            },
        });

        if (existingTrilha) {
            return res.status(400).json({ message: 'Curso já adicionado à trilha.' });
        }

        // Cria uma nova trilha
        const newTrilha = await Trilha.create({
            ID_User,
            ID_Curso,
            Progresso: 0,
        });

        res.status(status.CREATED).json({ message: 'Trilha criada com sucesso!', newTrilha });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao registrar a trilha.',
            error: error.message,
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
                    attributes: ['Nome_Curso', 'Nivel', 'Carga_Horaria', 'QuantidadeAulas']
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
        include: [
            {
                model: Curso,
                as: 'curso',
                attributes: ['Nome_Curso', 'Nivel', 'Carga_Horaria', 'QuantidadeAulas']
            }
        ]
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
                    attributes: ['id', 'Nome_Curso', 'Link', 'Nivel', 'Carga_Horaria', 'QuantidadeAulas']  // Adicione QuantidadeAulas
                }
            ]
        });
        res.status(200).json(trilhas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Atualizar o progresso de uma trilha específica
exports.UpdateProgress = async (req, res) => {
    const { userId, cursoId } = req.params;  // Captura o ID do usuário e do curso
    const { progresso } = req.body;  // Recebe o novo progresso do corpo da requisição

    try {
        const trilha = await Trilha.findOne({
            where: {
                ID_User: userId,
                ID_Curso: cursoId,
            },
        });

        if (trilha) {
            trilha.Progresso = progresso;  // Atualiza o progresso
            await trilha.save();  // Salva as alterações no banco
            res.status(status.OK).json({ message: 'Progresso atualizado com sucesso!' });
        } else {
            res.status(status.NOT_FOUND).json({ message: 'Trilha não encontrada para o usuário e curso especificados.' });
        }
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao atualizar o progresso.',
            error: error.message,
        });
    }
};

// Excluir uma trilha específica de um usuário para um curso específico
exports.Delete = async (req, res) => {
    const { userId, cursoId } = req.params;

    try {
        const trilha = await Trilha.findOne({
            where: {
                ID_User: userId,
                ID_Curso: cursoId,
            },
        });

        if (trilha) {
            await trilha.destroy();  // Exclui a trilha
            res.status(status.OK).json({ message: 'Trilha removida com sucesso!' });
        } else {
            res.status(status.NOT_FOUND).json({ message: 'Trilha não encontrada para o usuário e curso especificados.' });
        }
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao excluir a trilha.',
            error: error.message,
        });
    }
};


