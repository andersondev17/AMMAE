const mongoose = require('mongoose');

const dbconnect = () => {
    mongoose.connect('mongodb://localhost:27017/tiendaBD', {
        useNewUrlParser: true,//analizzador nuevo de url en lugar del antiguo
        useUnifiedTopology: true// nuevo motor de gestion de bases de datos
    })
    
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        console.log(error);
    });
}

module.exports = dbconnect;