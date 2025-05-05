module.exports = app => {
    require('./album.routes')(app);
    require('./artist.routes')(app);
    require('./genre.routes')(app);
    require('./song.routes')(app);
}