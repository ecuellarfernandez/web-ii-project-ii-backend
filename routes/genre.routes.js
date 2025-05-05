module.exports = app => {
    let validateFile = require("../middlewares/fileValidation.js");
    let router = require("express").Router();
    const controller = require("../controllers/genre.controller.js");

    router.get("/", controller.getGenreList);
    router.get("/:id", controller.getGenreById);
    router.post("/",validateFile("image"), controller.postGenreCreate);
    router.put("/:id", controller.putGenreUpdate);
    router.patch("/:id", controller.patchGenreUpdate);
    router.delete("/:id", controller.deleteGenre);

    app.use('/genres', router);
};