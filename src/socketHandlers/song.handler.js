const { chatTextService, spotifyService, playlistService, songService } = require('../services/');
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
 * @param {Object} data - 클라이언트 소켓으로부터 전달받은 데이터
 */
const handleTextEvent = async (socket, userTextList, lastProcessedIndex, data) => {
  const { chatText, playlistId } = data;
  const socketId = socket.id;

  // 문장 추출 결과
  const extractedSentences = await chatTextService.processList(chatText, userTextList, socketId);

  // 소켓 id가 마지막으로 처리한 데이터의 인덱스 가져오기
  let startIndex = lastProcessedIndex[socketId] || 0;

  // 새로 추가도니 데이터만 처리하기 위한 슬라이스
  const newSentences = extractedSentences.slice(startIndex);

  // 스포티파이 검색 결과 가져오기
  for (const sentence of newSentences) {
    const [artist, title, comment, tag] = sentence;
    const song = await getSpotifySongData(artist, title);
    const image = JSON.stringify(song.album.images);
    const videoId = await getYoutubeVideoId(artist, title);
    const songInfo = {
      vidId: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: song.name,
      artist: song.artists[0].name,
      thumb: image,
      playlist: playlistId,
    };
    try {
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
      }
      throw new Error('노래 데이터 db 저장 오류');
      break;
    }
  }
};

module.exports = (socket, userTextList, lastProcessedIndex) => {
  socket.on(
    'text',
    socketAsyncWrap(socket, (s, data) => handleTextEvent(s, userTextList, lastProcessedIndex, data)),
  );
};
