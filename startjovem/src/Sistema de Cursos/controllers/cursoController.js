const Curso = require('../models/curso');
const status = require('http-status');
const AreaProfi = require('../models/areaProfi');

// Inserir um novo curso
exports.Insert = async (req, res) => {
    const { Nome_Curso, Descricao_Curso, Carga_Horaria, Nivel, ID_AreaProfi, Link } = req.body;

    try {
        const newCurso = await Curso.create({
            Nome_Curso,
            Descricao_Curso,
            Carga_Horaria,
            Nivel,
            ID_AreaProfi,
            Link
        });
        res.status(status.CREATED).json({ message: 'Curso criado com sucesso!', newCurso });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao registrar o curso.',
            error: error.message
        });
    }
};

exports.SearchAll = async (req, res) => {
    try {
        const cursos = await Curso.findAll({
            order: [['id', 'DESC']],
            include: [{
                model: AreaProfi,
                as : 'areaProfi',  // Usar o alias definido na associação
                attributes: ['Nome_Area']  // Defina os campos que deseja incluir
            }]
        });
        res.status(200).send(cursos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Buscar um curso por ID
exports.SearchOne = (req, res) => {
    const id = req.params.id;
    Curso.findByPk(id, {
        include: ['AreaProfi']  // Inclui os dados da tabela de áreas profissionais
    })
        .then((curso) => {
            if (curso) {
                res.status(status.OK).send(curso);
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Atualizar um curso
exports.Update = (req, res) => {
    const id = req.params.id;
    const { Nome_Curso, Descricao_Curso, Carga_Horaria, Nivel, ID_AreaProfi, Link } = req.body;

    Curso.findByPk(id)
        .then((curso) => {
            if (curso) {
                return curso.update({ Nome_Curso, Descricao_Curso, Carga_Horaria, Nivel, ID_AreaProfi, Link });
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
