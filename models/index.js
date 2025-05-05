const {sequelize} = require('../config/db.config');

const artist = require('./Artist')(sequelize);
const album = require('./Album')(sequelize);
const genre = require('./Genre')(sequelize);
const song = require('./Song')(sequelize);

//Artist 1 to many Album
artist.hasMany(album,{
    foreignKey: 'artistId',
    as: 'albums'
});
album.belongsTo(artist,{
    foreignKey: 'artistId',
    as: 'artist'
});

//Album 1 to many Song
album.hasMany(song, {
    foreignKey: 'albumId',
    as: 'songs'
});
song.belongsTo(album, {
    foreignKey: 'albumId',
    as: 'album'
});

//many genres to many Artist
genre.belongsToMany(artist,{
    through: 'artist_genre',
    as: 'artists'
});
artist.belongsToMany(genre,{
    through: 'artist_genre',
    as: 'genres'
});

module.exports = {
    artist,
    album,
    genre,
    song,
    sequelize,
    Sequelize: sequelize.Sequelize
}