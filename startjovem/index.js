const http = require('http');
const express = require('express');
const status = require('http-status');
const sequelize = require('./src/database/database');
const app = express();
const routes = require('./src/routes/routes');
const cors = require('cors');

// Importando múltiplos modelos
const Login_User = require('./src/models/login');  // Modelo Login
const Usuario = require('./src/models/usuario');  // Modelo Usuario
const Cadastro = require('./src/models/cadastro');  // Modelo Cadastro
const User = require('./src/Sitemas de Login/models/user');  // Modelo Cadastro


app.use(express.json());
app.use(cors());
app.use('/sistema', routes);

app.use((req, res, next) => {
    res.status(status.NOT_FOUND).send("Page not found");
});

app.use((error, req, res, next) => {
    res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.message });
});

// Sincronizando o banco de dados com as tabelas Produto e Usuario
sequelize.sync({ alert: false }).then(() => {
    const port = 3003;
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port);
    console.log(`Server running on port ${port}`);
}).catch(err => {
    console.error('Unable to sync database:', err);
});



