const { playlistService, groupService, songService } = require('../services');
const { ConflictError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

const getPlaylistSong = async (req, res) => {
  // parameter로 선택한 groupId 전달
  const groupId = req.params.id;
  let playlistId = await groupService.findGroupPlaylist(groupId);
  // console.log('===================');
  // console.log(playlistId.playlist[0].id);
  // console.log('===================');
  playlistId = playlistId.playlist[0].id;
  if (!playlistId) {
    throw new ConflictError('존재하지 않는 플레이리스트 입니다.');
  }
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const socket = req.app.get('io');
  const connectUser = req.app.get('connectUsers');
  socket.to(connectUser[clientIp]).emit('playlist', playlistId);
  const playlist = await playlistService.findPlaylistSong(playlistId);

  if (!playlist || !playlist.song) {
    return res.status(StatusCodes.OK).json([]);
  }
  const songs = playlist.song;

  return res.status(StatusCodes.OK).json(songs);
};

const getPlaylistSongSocket = async (req, res) => {
  const playlistId = req.params.id;
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const socket = req.app.get('io');
  const connectUser = req.app.get('connectUser');
  socket.to(connectUser[clientIp]).emit('playlist', playlistId);
  if (!playlistId) {
    throw new ConflictError('존재하지 않는 플레이리스트 입니다.');
  }

  // // sockets가 Map 객체로 이루어져 있기 때문에 for..in이 아닌 forEact() 메서드 사용
  // function printClientSocketIds() {
  //   console.log('--- Connected Clients ---');
  //   io.sockets.sockets.forEach((socket, clientId) => {
  //     console.log('Client Socket ID:', clientId);
  //   });
  // }

  // function sendMessageToUser() {
  //   const clients = io.sockets.sockets;
  //   clients.forEach((socket, clientId) => {
  //     console.log(clientId);
  //   });
  // }
  // sendMessageToUser();

  // if (!socket.ip) {
  //   throw new ConflictError('캡쳐 프로그램을 먼저 실행시켜주세요.');
  // }
  // socket.emit('playlist', playlistId);
  // const playlist = await playlistService.findPlaylistSong(playlistId);
  // const songs = playlist.song;
  // return res.status(StatusCodes.OK).json(songs);
};

module.exports = {
  getPlaylistSong,
  getPlaylistSongSocket,
};
