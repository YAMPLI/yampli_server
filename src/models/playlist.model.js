const mongoose = require('mongoose');
// const { PlaylistSong } = require('../models');
const PlaylistSong = require('./playlistSong.model');

const playlistSchema = mongoose.Schema({
  title: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlaylistSong' }], // songs 필드를 playlistSongSchema로 변경
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

// Playlist 스키마 (playlist.js)
playlistSchema.pre('remove', async function (next) {
  await PlaylistSong.find({ playlist: this._id }).then((songs) => songs.forEach((song) => song.remove()));
  next();
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
