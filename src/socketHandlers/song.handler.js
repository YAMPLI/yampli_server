const { Song } = require('../models');
const { chatTextService, spotifyService, playlistService } = require('../services/');
const { socketAsyncWrap } = require('../api/middlewares/async');
const { getYoutubeVideoId } = require('../integrations/youtubeAPI');

/**
 *
 * @param {String} artist - 가수이름
 * @param {String} title  - 노래제목
 * @returns {Promise} - 스포티파이 노래 검색 결과를 반환하는 promise 객체
 */
const getSpotifySongData = (artist, title) => {
  const song = spotifyService.getSong(artist, title);
  return song;
};

/**
 * 전달받은 텍스트로 song 데이터 생성하는 소켓 핸들러
 *
 * @param {SocketIO.Socket} socket - 연결 소켓
 * @param {Object} userTextList - 저장된 노래 정보 [가수, 제목, 댓글, 태그]
 * @param {Object} data - Data received from the client.
 */
const handleTextEvent = async (socket, userTextList, data) => {
  const chatText = data.chatText;
  const playlistId = data.playlistId;
  const socketId = socket.id;

  // 문장 추출 결과
  const extractedSentences = await chatTextService.processList(chatText, userTextList, socketId);
  // 스포티파이 검색 결과 가져오기
  for (const sentence of extractedSentences) {
    const [artist, title, comment, tag] = sentence;
    const song = await getSpotifySongData(artist, title);
    const spotifyArtist = song.artists[0].name;
    const spotifyTitle = song.name;
    const image = JSON.stringify(song.album.images);
    const videoId = await getYoutubeVideoId(artist, title);
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const songInfo = {
      vidId: videoId,
      url: url,
      title: spotifyTitle,
      artist: spotifyArtist,
      thumb: image,
      playlist: playlistId,
    };
    try {
      const createSong = await Song.create(songInfo);
      const datacheck = await playlistService.addSongToPlaylist(playlistId, createSong._id);
      console.log('====');
      console.log(datacheck);
      console.log('====');
    } catch (err) {
      console.log(err);
    }

    socket.emit('check', videoId);
  }
};

module.exports = (socket, userTextList) => {
  socket.on(
    'text',
    socketAsyncWrap((data) => handleTextEvent(socket, userTextList, data)),
  );
};
