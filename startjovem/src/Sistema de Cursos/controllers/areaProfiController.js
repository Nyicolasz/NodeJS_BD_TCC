const AreaProfi = require('../models/areaProfi');
const status = require('http-status');

// Inserir uma nova área profissional
exports.Insert = async (req, res) => {
    const { Nome_Area, Descricao_Area } = req.body;

    try {
        const newArea = await AreaProfi.create({
            Nome_Area,
            Descricao_Area
        });
        res.status(status.CREATED).json({ message: 'Área profissional criada com sucesso!', newArea });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: 'Erro ao registrar a área profissional.',
            error: error.message
        });
    }
};

// Listar todas as áreas profissionais
exports.SearchAll = (req, res) => {
    AreaProfi.findAll()
        .then((areas) => res.status(status.OK).send(areas))
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Buscar uma área profissional por ID
exports.SearchOne = (req, res) => {
    const id = req.params.id;
    AreaProfi.findByPk(id)
        .then((area) => {
            if (area) {
                res.status(status.OK).send(area);
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Atualizar uma área profissional
exports.Update = (req, res) => {
    const id = req.params.id;
    const { Nome_Area, Descricao_Area } = req.body;

    AreaProfi.findByPk(id)
        .then((area) => {
            if (area) {
                return area.update({ Nome_Area, Descricao_Area });
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .then((updatedArea) => res.status(status.OK).json({ message: 'Área profissional atualizada com sucesso!', updatedArea }))
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));
};

// Excluir uma área profissional
exports.Delete = (req, res) => {
    const id = req.params.id;

    AreaProfi.findByPk(id)
        .then((area) => {
            if (area) {
                return area.destroy();
            } else {
                res.status(status.NOT_FOUND).send();
            }
        })
        .then(() => res.status(status.NO_CONTENT).send())
        .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message }));

    };
