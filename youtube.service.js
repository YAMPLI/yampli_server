const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const { textData } = require('./text.service');
const { getValidToken } = require('./tokenStoreTest');
const test1 = [
  '한정',
  '8월21일 영민. 8월 28일 엄마',
  '79798166468 카카오뱅크 오전 10:22',
  '2023년 8월 2일 수요일',
  '$ 백예린,스퀘어,이거 가을날씨에 듣기 딱임, 감성',
  '얌플리데이터',
  '생성중',
  '$ 아이유,라일락, 이거 좋더라',
  '생성 오후 6:01',
  '$인피니트, 내꺼하자, 얘네 컴백했더라, 댄스',
  '중간에 추천하면? $zb1, 인불름, 서바이벌 1위한 애들이래,최신곡 오후 6:02',
  '$$ 백예린,스퀘어,이거 가을날씨에 듣기 딱임, 감성',
  '얌플리데이터\\',
  '생성중',
  '$$ 아이유,라일락, 이거 좋더라',
  '생성',
  '$$인피니트, 내꺼하자, 얘네 컴백했더라, 댄스 오후 6:14',
  '중간에 추천하면? $$zb1, 인블름, 서바이벌 1위한 애들이래,최신곡 오후 6:15',
  '2023년 8월 3일 목요일',
  '기본중명서 , 가족관계중명서, 오후 1:23',
  '2023년 8월 8일 화요일',
  '아빠 입금 오후 11:46',
  '2023년 8월 9일 수요일',
  '金 (',
  '전송',
];

const test = [
  '중간에 추천하면? $zb1, 인불름, 서바이벌 1위한 애들이래,최신곡 오후 6:02',
  '중간에 추천하면? $$zb1, 인블름, 서바이벌 1위한 애들이래,최신곡 오후 6:15',
];
const musicList = textData(test1);

const saveVideo = () => {
  musicList.map(async (music) => {
    const [artist, title, comment, tag] = music;
    // 유튜브
    // const videoData = await findVideo(artist, title);
    // 스포티파이
    const videoData = await spotifyApi(artist, title);
    if (videoData) {
      console.log(`${artist} : ${title} : ${videoData.name} : ${videoData} `);
    }
  });
};

// api를 사용하지 않고 데이터에서 직접 추출
const findVideo = async (artist, title) => {
  const word = `${artist} ${title} audio`;
  const response = await axios.get(`https://www.youtube.com/results?search_query=${word}`);
  let regex = /\"/g;
  // 영상 제목(가수 - 노래제목), 스포티파이 검색 결과 정확도 높이기 위해서 사용
  const check = response.data
    .split('{"videoRenderer":{"videoId":"')[1]
    .split('{"text":')[1]
    .split('}]')[0]
    .replace(regex, '');
  fs.appendFileSync('check-json1.html', check + '\n');
  return response.data.split('{"videoRenderer":{"videoId":"')[1].split('"')[0];
};

const spotifyApi = async (artist, title) => {
  const token = await getValidToken();
  const query = `"${artist}" "${title}"`;
  const params = {
    q: query,
    type: 'track',
    limit: 3,
  };
  const url = `https://api.spotify.com/v1/search?${qs.stringify(params)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(url, { headers: headers });
    if (response.data.tracks.items.length > 0) {
      console.log(`===============${artist} : ${title}===================`);
      console.log(response.data.tracks.items[0].album);
      return response.data.tracks.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
};
// // 결과를 처리하고 출력하기 위한 비동기 함수를 정의합니다.
// const getYoutubeData = async () => {
//   const data = textData(test);
//   const data = await findVideo('wanna love you', '폴킴');
//   console.log(data);
// };

console.log(saveVideo());
