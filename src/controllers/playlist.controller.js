const { playlistService } = require('../services');
const { ConflictError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

const getPlaylistSong = async (req, res) => {
  const playlistId = req.params.id;
  if (!playlistId) {
    throw new ConflictError('존재하지 않는 플레이리스트 입니다.');
  }
  const playlist = await playlistService.findPlaylistSong(playlistId);
  const songs = playlist.song;
  return res.status(StatusCodes.OK).json(songs);
};

module.exports = {
  getPlaylistSong,
};
