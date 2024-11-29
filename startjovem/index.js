const http = require('http');
const express = require('express');
const status = require('http-status');
const sequelize = require('./src/database/database');
const app = express();
const routes = require('./src/routes/routes');
const cors = require('cors');
const path = require('path'); // Adicionado para servir arquivos estáticos

// Importando múltiplos modelos
const User = require('./src/Sitemas de Login/models/user');  // Modelo User
const Feedback = require('./src/Sistema de Feedback/models/feedback');  // Modelo Feedback
const AreaProfi = require('./src/Sistema de Cursos/models/areaProfi');
const Cursos = require('./src/Sistema de Cursos/models/curso');
const Trilhas = require('./src/Sistema de Trilhas/models/trilha');
const VerificacaoCode = require('./src/Sitemas de Login/models/VerificationCode');



app.use(express.json());
app.use(cors());
app.use('/sistema', routes);

// Configuração para servir a pasta "uploads" como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    res.status(status.NOT_FOUND).send("Page not found");
});

app.use((error, req, res, next) => {
    res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message });
});

// Sincronizando o banco de dados com as tabelas Produto e Usuario
sequelize.sync({ force: true }).then(() => {
    const port = 3003;
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port);
    console.log(`Server running on port ${port}`);
}).catch(err => {
    console.error('Unable to sync database:', err);
});

