const express = require('express');
const asyncWrap = require('../middlewares/async');
const { playlistController } = require('../../controllers');
const song = require('../../models/song.models');
const playlist = require('../../models/playlist.model');
const router = express.Router();

// http://localhost:5000/api/group/test/123123
// 그룹 선택 후 플레이리스트 id 전송해서 캡쳐진행
// router.route('/:id').get(async (req, res) => {
//   const socket = req.app.get('io');
//   socket.emit('user', id);
//   console.log('test');
//   console.log(id);

//   res.send(200);
// });

// 파이썬 캡쳐 동작
// router.route('/socket/:id').get(asyncWrap(playlistController.getPlaylistSongSocket));

// 디자인 확인 위한 임시 라우터
router.route('/socket/:id').get(asyncWrap(playlistController.getPlaylistSong));

// 플레이리스트 목록 보기
router.route('/:id').get(asyncWrap(playlistController.getPlaylistSong));

// 노래 추가 임시
// router.route('/test').post(async (req, res) => {
//   const song1 = await song.create(req.body);
//   await playlist.update(
//     { _id: { $in: req.body.playlist } },
//     {
//       $push: {
//         song: song1._id,
//       },
//     },
//   );
//   res.send(200);
// });
module.exports = router;
