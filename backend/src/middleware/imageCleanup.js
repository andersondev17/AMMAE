const imageCleanup = (req, res, next) => {
    // Solo limpiar si hay imágenes en el body
    if (req.body?.imagenes && Array.isArray(req.body.imagenes)) {
        req.body.imagenes = req.body.imagenes
            .map(img => {
                if (!img || typeof img !== 'string') return null;
                
                // SIMPLE: Solo quitar rutas y mantener nombre de archivo
                return img.replace(/^.*[\\\/]/, '').trim();
            })
            .filter(Boolean);
    }
    next();
};

module.exports = imageCleanup;