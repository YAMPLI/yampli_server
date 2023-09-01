const mongoose = require('mongoose');

const { chatTextService, spotifyService, playlistService, songService } = require('../services/');
const { socketAsyncWrap } = require('../api/middlewares/async');
const { getYoutubeVideoId } = require('../integrations/youtubeAPI');

/**
 * 스포티파이 노래 데이터를 가져오는 함수
 *
 * @param {String} artist - 가수이름
 * @param {String} title  - 노래제목
 * @returns {Promise} - 스포티파이 노래 검색 결과를 반환하는 promise 객체
 */
const getSpotifySongData = (artist, title) => {
  return spotifyService.getSongInfo(artist, title);
};

/**
 * 소켓을 통해 전송받은 텍스트를 처리하고 노래 데이터를 생성하는 경우
 *
 * @param {SocketIO.Socket} socket - 연결 소켓
 * @param {Object} userTextList - 저장된 노래 정보 [가수, 제목, 댓글, 태그]
 * @param {Object} lastProcessedIndex - 처리된 데이터의 인덱스를 추적하는 객체
 * @param {Object} data - 클라이언트 소켓으로부터 전달받은 데이터
 */
const handleTextEvent = async (socket, userTextList, lastProcessedIndex, data) => {
  const { chatText, playlistId } = data;
  const socketId = socket.id;

  // 문장 추출 결과
  const extractedSentences = await chatTextService.processList(chatText, userTextList, socketId);

  // 소켓 id의 마지막으로 처리한 데이터의 인덱스 가져오기
  let startIndex = lastProcessedIndex[socketId] || 0;

  // 새로 추가된 데이터만 처리하기 위한 슬라이스
  const newSentences = extractedSentences.slice(startIndex);

  // 스포티파이 검색 결과 가져오기
  for (const sentence of newSentences) {
    const [artist, title, comment, tag] = sentence;
    let videoId;
    try {
      const song = await getSpotifySongData(artist, title);
      // 썸네일로 사용할 이미지 url만 뽑아서 저장
      const imageUrls = song.album.images.map((img) => img.url);
      videoId = await getYoutubeVideoId(artist, title);

      const songInfo = {
        vidId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: song.name,
        artist: song.artists[0].name,
        thumb: imageUrls,
        playlist: playlistId,
      };

      const createSong = await songService.createSong(songInfo);

      await playlistService.addSongToPlaylist(playlistId, createSong._id);

      lastProcessedIndex[socketId] = startIndex + 1;
      startIndex++;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError || err.code === 11000 || err.code === 11001) {
        // 이미 존재한 vidId를 갖는 song이 있는지 확인
        const findSong = await songService.findSongByVidId(videoId);

        // 플레이리스트에 song이 이미 포함되었는지 확인
        const playlistWithSong = await playlistService.findPlaylistWithSong(playlistId, findSong._id);

        if (!playlistWithSong) {
          await playlistService.addSongToPlaylist(playlistId, findSong._id);
        }
      } else {
        throw new Error('노래 데이터 db 저장 오류');
      }
      break;
    }
  }
};

/**
 *
 * @param {SocketIO.socket} socket - 연결된 소켓
 * @param {Object} userTextList - 저장된 노래 정보 [가수, 제목, 댓글, 태그]
 * @param {Object} lastProcessedIndex - 처리된 데이터의 인덱스를 추적하는 객체
 */
module.exports = (socket, userTextList, lastProcessedIndex) => {
  socket.on(
    'text',
    socketAsyncWrap(socket, (s, data) => handleTextEvent(s, userTextList, lastProcessedIndex, data)),
  );
};
