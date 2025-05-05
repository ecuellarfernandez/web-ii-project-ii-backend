const db = require("../models");
const { handleFileUpload } = require("../utils/fileHandler");
const song = db.song;
const fs = require('fs');

exports.getSongList = async (req, res) => {
    const songs = await song.findAll({
        include: [
            'album'
        ],
    });
    res.send(songs);
};

exports.getSongById = async (req, res) => {
    const { id } = req.params;
    const songData = await song.findByPk(id, {
        include: [
            'album'
        ],
    });
    if (!songData) {
        return res.status(404).send({ message: 'Canción no encontrada' });
    }
    res.send(songData);
};

exports.postSongCreate = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).send({ message: "El archivo de la canción es requerido" });
        }

        const filePath = await handleFileUpload(req.files.file, 'song');
        const songData = {
            title: req.body.title,
            file: filePath,
            albumId: req.body.albumId
        };

        const { errors } = validateSongRequest({ body: songData });
        if (errors) {
            fs.unlinkSync(filePath);
            return res.status(400).send(errors);
        }

        const songCreated = await song.create(songData);
        if (!songCreated) {
            fs.unlinkSync(filePath);
            return res.status(500).send({ message: "Error al crear la canción" });
        }

        res.status(201).send(songCreated);
    } catch (error) {
        res.status(500).send({
            message: "Error al crear la canción",
            error: error.message
        });
    }
};
exports.patchSongUpdate = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Petición inválida" });
    }
    const { id } = req.params;
    const songToUpdate = await song.findByPk(id);
    if (!songToUpdate) {
        return res.status(404).send({ message: 'Canción no encontrada' });
    }
    const { title, file, albumId } = req.body;
    if (title) {
        songToUpdate.title = title;
    }
    if (file) {
        songToUpdate.file = file;
    }
    if (albumId) {
        songToUpdate.albumId = albumId;
    }
    const songSaved = await songToUpdate.save();
    if (!songSaved) {
        res.status(500).send({ message: "Error al editar la canción" });
        return;
    }
    res.send(songSaved);
};

exports.putSongUpdate = async (req, res) => {
    const validationResponse = validateSongRequest(req);
    if (validationResponse.errors) {
        res.status(400).send(validationResponse.errors);
        return;
    }
    const { id } = req.params;
    const body = validationResponse.songData;

    const songToUpdate = await song.findByPk(id);
    if (!songToUpdate) {
        return res.status(404).send({ message: 'Canción no encontrada' });
    }
    songToUpdate.title = body.title;
    songToUpdate.file = body.file;
    const songSaved = await songToUpdate.save();
    if (!songSaved) {
        res.status(500).send({ message: "Error al editar la canción" });
        return;
    }

    res.send(songSaved);
};

exports.deleteSong = async (req, res) => {
    const { id } = req.params;
    const songToDelete = await song.findByPk(id);
    if (!songToDelete) {
        return res.status(404).send({ message: 'Canción no encontrada' });
    }
    await songToDelete.destroy();
    res.status(204).send('');
};

const validateSongRequest = (req) => {
    if (!req.body) {
        return { errors: { message: "Petición inválida" } };
    }
    const { title, file } = req.body;
    const errors = {};

    if (!title) errors.title = "El título es requerido";
    if (!file) errors.file = "El archivo es requerido";

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    return {
        errors: null,
        songData: {
            title,
            file
        }
    };
};