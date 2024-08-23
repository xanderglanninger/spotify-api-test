require("dotenv").config();
const Spotify = require("node-spotify-api");

const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
});

const getSongDetails = (songName) => {
  return new Promise((resolve, reject) => {
    spotify.search(
      { type: "track", query: songName, limit: 1 },
      (err, data) => {
        if (err) {
          return reject("Error occurred: " + err);
        }
        const song = data.tracks.items[0];
        if (song) {
          let arr = [
            song.artists.map((artist) => artist.name).join(", "),
            song.name,
            song.preview_url,
            song.album.name,
          ];
          resolve(arr);
        } else {
          resolve(["No song found with that name."]);
        }
      }
    );
  });
};

module.exports = { getSongDetails };
