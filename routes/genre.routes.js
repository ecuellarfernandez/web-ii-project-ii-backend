module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/genre.controller.js");

    router.get("/", controller.getGenreList);
    router.get("/:id", controller.getGenreById);
    router.post("/", controller.postGenreCreate);
    router.put("/:id", controller.putGenreUpdate);
    router.patch("/:id", controller.patchGenreUpdate);
    router.delete("/:id", controller.deleteGenre);

    app.use('/genres', router);
};