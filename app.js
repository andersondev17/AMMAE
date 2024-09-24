const express = require('express');
const app = express();
const dbconnect = require('./config/dbconnect');
const router = require('./routes');
const port = 3001;

app.use(express.json());
dbconnect();

app.use('/', router);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
});
