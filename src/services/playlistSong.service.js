const { PlaylistSong, Comment, Like, Playlist } = require('../models');

/**
 * 플레이리스트에 포함된 노래 및 연관데이터 삭제
 * @param {String} playlistSongId 
 */
const deletePlaylistSongAndRelatedData = async (playlistSongId) => {
  await Comment.deleteMany({ source: this._id });
  await Like.deleteMany({ target: this._id, targetType: 'PlaylistSong' });
  // 플레이리스트 데이터 삭제
  await Playlist.updateMany({}, { $pull: { playlists: playlistSongId } });
  await PlaylistSong.findOneAndDelete(playlistSongId);
};

module.exports = {
  deletePlaylistSongAndRelatedData,
};
