const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Album = sequelize.define(
        'Album',
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false
            },
            releaseDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            artistId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    );
    return Album;
};