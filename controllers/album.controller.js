const db = require("../models");
const { handleFileUpload } = require("../utils/fileHandler");
const album = db.album;
const fs = require('fs');

exports.getAlbumList = async (req, res) => {
    const albums = await album.findAll({
        include: [
            'artist',
        ],
    });
    res.send(albums);
};

exports.getAlbumById = async (req, res) => {
    const { id } = req.params;
    const albumData = await album.findByPk(id, {
        include: [
            'artist',
            'songs'
        ],
    });
    if (!albumData) {
        return res.status(404).send({ message: 'Álbum no encontrado' });
    }
    res.send(albumData);
};

exports.postAlbumCreate = async (req, res) => {
    try {
        const imagePath = await handleFileUpload(req.files.image, 'album');
        const albumData = {
            title: req.body.title,
            artistId: req.body.artistId,
            releaseDate: req.body.releaseDate,
            image: imagePath
        };
        const { errors } = validateAlbumRequest({ body: albumData });
        if (errors) {
            fs.unlinkSync(imagePath);
            return res.status(400).send(errors);
        }

        const albumCreated = await album.create(albumData);
        if (!albumCreated) {
            fs.unlinkSync(imagePath);
            return res.status(500).send({ message: "Error al crear el álbum" });
        }
        res.status(201).send(albumCreated);
    } catch (error) {
        res.status(500).send({
            message: "Error al crear el álbum",
            error: error.message
        });
    }
};

exports.patchAlbumUpdate = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Petición inválida" });
    }
    const { id } = req.params;
    const albumToUpdate = await album.findByPk(id);
    if (!albumToUpdate) {
        return res.status(404).send({ message: 'Álbum no encontrado' });
    }
    const { title, artistId, releaseDate, image } = req.body;
    if (title) albumToUpdate.title = title;
    if (artistId) albumToUpdate.artistId = artistId;
    if (releaseDate) albumToUpdate.releaseDate = releaseDate;
    if (image) albumToUpdate.image = image;

    const albumSaved = await albumToUpdate.save();
    if (!albumSaved) {
        res.status(500).send({ message: "Error al editar el álbum" });
        return;
    }
    res.send(albumSaved);
};

exports.putAlbumUpdate = async (req, res) => {
    const validationResponse = validateAlbumRequest(req);
    if (validationResponse.errors) {
        res.status(400).send(validationResponse.errors);
        return;
    }
    const { id } = req.params;
    const body = validationResponse.albumData;

    const albumToUpdate = await album.findByPk(id);
    if (!albumToUpdate) {
        return res.status(404).send({ message: 'Álbum no encontrado' });
    }
    albumToUpdate.title = body.title;
    albumToUpdate.artistId = body.artistId;
    albumToUpdate.releaseDate = body.releaseDate;
    albumToUpdate.image = body.image;

    const albumSaved = await albumToUpdate.save();
    if (!albumSaved) {
        res.status(500).send({ message: "Error al editar el álbum" });
        return;
    }
    res.send(albumSaved);
};

exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;
    const albumToDelete = await album.findByPk(id);
    if (!albumToDelete) {
        return res.status(404).send({ message: 'Álbum no encontrado' });
    }
    await albumToDelete.destroy();
    res.status(204).send('');
};

const validateAlbumRequest = (req) => {
    if (!req.body) {
        return { errors: { message: "Petición inválida" } };
    }
    const { title, artistId, releaseDate, image } = req.body;
    const errors = {};

    if (!title) errors.title = "El título es requerido";
    if (!artistId) errors.artistId = "El artistId es requerido";
    if (!releaseDate) errors.releaseDate = "La fecha de lanzamiento es requerida";
    if (!image) errors.image = "La imagen es requerida";

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    return {
        errors: null,
        albumData: {
            title,
            artistId,
            releaseDate,
            image
        }
    };
};