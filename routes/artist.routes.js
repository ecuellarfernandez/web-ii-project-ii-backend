module.exports = app => {
    let validateFile = require("../middlewares/fileValidation.js");
    let router = require("express").Router();
    const controller = require("../controllers/artist.controller.js");

    router.get("/", controller.getArtistList);
    router.get("/:id", controller.getArtistById);
    router.post("/", validateFile("image"), controller.postArtistCreate);
    router.put("/:id", controller.putArtistUpdate);
    router.patch("/:id", controller.patchArtistUpdate);
    router.delete("/:id", controller.deleteArtist);

    app.use('/artists', router);
};