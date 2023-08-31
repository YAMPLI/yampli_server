const express = require('express');
const router = express.Router();
const { playlistService, groupService } = require('../../services');
const { Group } = require('../../models');

// 플레이리스트 생성 테스트
router.route('/').post(async (req, res) => {
  const groupid = await Group.findOne();
  console.log(groupid);
  const playlistInfo = {
    title: '테스트플리',
    group: groupid._id,
  };
  await playlistService.createPlaylist(playlistInfo);
  res.status(400).json({ data: 'success' });
});

module.exports = router;
