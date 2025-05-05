const validateFile = (type) => (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({ message: 'No se subió ningún archivo' });
    }

    const file = type === 'image' ? req.files.image : req.files.file;
    if (!file) {
        return res.status(400).send({
            message: `El archivo ${type === 'image' ? 'imagen' : 'MP3'} es requerido` 
        });
    }

    if (type === 'image') {
        if (!file.mimetype.startsWith('image/')) {
            return res.status(400).send({ message: 'El archivo debe ser una imagen' });
        }
    } else {
        if (!file.mimetype.includes('audio')) {
            return res.status(400).send({ message: 'El archivo debe ser un MP3' });
        }
    }

    next();
};

module.exports = validateFile;