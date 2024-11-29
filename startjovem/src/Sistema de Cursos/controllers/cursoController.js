const Curso = require('../models/curso');
const status = require('http-status');
const AreaProfi = require('../models/areaProfi');

// Inserir um novo curso
exports.Insert = async (req, res) => {
    const { Nome_Curso, Descricao_Curso, Carga_Horaria, Nivel, ID_AreaProfi, Link, QuantidadeAulas } = req.body;

    try {

        const newCurso = await Curso.create({
            Nome_Curso,
            Descricao_Curso,
            Carga_Horaria,
            Nivel,
            ID_AreaProfi,
            Link,
            QuantidadeAulas

        });
        res.status(status.CREATED).json({ message: 'Curso criado com sucesso!', newCurso });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao registrar o curso.',
            error: error.message
        });
    }
};
// Buscar todos os cursos
exports.SearchAll = async (req, res) => {
    try {
        const cursos = await Curso.findAll({
            attributes: ['id', 'Nome_Curso', 'Descricao_Curso', 'Carga_Horaria', 'Nivel', 'QuantidadeAulas', 'Link'], // Atributos do modelo Curso
            order: [['id', 'DESC']],
            include: [{
                model: AreaProfi,
                as: 'areaProfi', // Usar o alias definido na associação
                attributes: ['Nome_Area'] // Atributos da tabela AreaProfi
            }]
        });
        res.status(200).json(cursos); // Retorna os cursos com suas áreas associadas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar um curso por ID
exports.SearchOne = (req, res) => {
    const id = req.params.id;

    Curso.findByPk(id, {
        attributes: ['id', 'Nome_Curso', 'Descricao_Curso', 'Carga_Horaria', 'Nivel', 'QuantidadeAulas', 'Link'], // Atributos do modelo Curso
        include: [{
            model: AreaProfi,
            as: 'areaProfi', // Usar o alias definido na associação
            attributes: ['Nome_Area'], // Atributos da tabela AreaProfi
        }]
    })
        .then((curso) => {
            if (curso) {
                res.status(status.OK).send(curso); // Retorna o curso encontrado
            } else {
                res.status(status.NOT_FOUND).send(); // Retorna status 404 caso não encontre
            }
        })
        .catch((error) => {
            res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }); // Retorna erro interno
        });
};




// Atualizar um curso
exports.Update = (req, res) => {
    const id = req.params.id;
    const { Nome_Curso, Descricao_Curso, Carga_Horaria, Nivel, ID_AreaProfi, Link, QuantidadeAulas } = req.body;

    Curso.findByPk(id)
        .then((curso) => {
            if (curso) {
                return curso.update({ Nome_Curso, Descricao_Curso, Carga_Horaria, Nivel, ID_AreaProfi, Link, QuantidadeAulas });
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .then((updatedCurso) => res.status(status.OK).json({ message: 'Curso atualizado com sucesso!', updatedCurso }))
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Excluir um curso
exports.Delete = (req, res) => {
    const id = req.params.id;

    Curso.findByPk(id)
        .then((curso) => {
            if (curso) {
                return curso.destroy();
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .then(() => res.status(status.NO_CONTENT).send())
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};
