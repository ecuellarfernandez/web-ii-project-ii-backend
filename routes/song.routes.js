module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/song.controller.js");

    router.get("/", controller.getSongList);
    router.get("/:id", controller.getSongById);
    router.post("/", controller.postSongCreate);
    router.put("/:id", controller.putSongUpdate);
    router.patch("/:id", controller.patchSongUpdate);
    router.delete("/:id", controller.deleteSong);

    app.use('/songs', router);
};