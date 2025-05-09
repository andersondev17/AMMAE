const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://andersondev17:IOWIRH7kAzacsDVT@ammae.dohth.mongodb.net/')
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error:', err));