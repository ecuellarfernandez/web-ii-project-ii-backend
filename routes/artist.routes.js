module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/artist.controller.js");

    router.get("/", controller.getArtistList);
    router.get("/:id", controller.getArtistById);
    router.post("/", controller.postArtistCreate);
    router.put("/:id", controller.putArtistUpdate);
    router.patch("/:id", controller.patchArtistUpdate);
    router.delete("/:id", controller.deleteArtist);

    app.use('/artists', router);
};