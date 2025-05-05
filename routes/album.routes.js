module.exports = app => {
    let validateFile = require("../middlewares/fileValidation.js");
    let router = require("express").Router();
    const controller = require("../controllers/album.controller.js");

    router.get("/", controller.getAlbumList);
    router.get("/:id", controller.getAlbumById);
    router.post("/", validateFile("image"), controller.postAlbumCreate);
    router.put("/:id", controller.putAlbumUpdate);
    router.patch("/:id", controller.patchAlbumUpdate);
    router.delete("/:id", controller.deleteAlbum);

    app.use('/albums', router);
};