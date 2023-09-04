const { playlistService, groupService } = require('../services');
const { ConflictError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

/**
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns
 */
const getPlaylistSong = async (req, res) => {
  // parameter로 전달받은 groupId
  const groupId = req.params.id;

  // 그룹이 갖고 있는 플레이리스트
  const groupPlaylist = await groupService.findGroupPlaylist(groupId);
  // '?.' 문법을 사용해서, 이전 객체 요소 값이 null이나 undefined인 경우에도 에러를 발생시키지 않고 undefined를 반환하도록 한다.
  // 그래야 아래 playlistId 존재 유무를 비교해서 원하는 시나리오대로 진행 가능
  const playlistId = groupPlaylist?.playlist?.[0]?.id;

  if (!playlistId) {
    throw new ConflictError('존재하지 않는 플레이리스트 입니다.');
  }

  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const socket = req.app.get('io');
  const connectUser = req.app.get('connectUsers');
  socket.to(connectUser[clientIp]).emit('playlist', playlistId);

  const playlist = await playlistService.findPlaylistSong(playlistId);

  if (!playlist || !playlist.songs) {
    return res.status(StatusCodes.OK).json([]);
  }
  const songs = playlist.songs;
  return res.status(StatusCodes.OK).json(songs);
};

module.exports = {
  getPlaylistSong,
};
