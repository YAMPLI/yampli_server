const test = [
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

const test2 = [
  '$$ 백예린,스퀘어,이거 가을날씨에 듣기 딱임, 감성',
  '얌플리데이터\\',
  '생성중',
  '$$ 아이유,라일락, 이거 좋더라',
  '생성',
  '$$인피니트, 내꺼하자, 얘네 컴백했더라, 댄스 오후 6:14',
  '중간에 추천하면? $$zb1, 인블름, 서바이벌 1위한 애들이래,최신 오후 6:15',
  '2023년 8월 3일 목요일',
  '기본중명서 , 가족관계중명서, 오후 1:23',
  '2023년 8월 8일 화요일',
  '아빠 입금 오후 11:46',
  '2023년 8월 9일 수요일',
  '金 (',
  '전송',
];

// let text = [];
// let nSet = new Set();
// test.map((list) => {
//   // $$인 경우 고려해서 마지막 index부터 탐색
//   let idx = list.lastIndexOf('$');
//   if (idx != -1) {
//     // idx+1($제외시키기위해)부터 문자열 끝까지 양쪽 공백을 제거해서 배열에 담는다.
//     list = list.substring(idx + 1, list.length).trim();
//     let parts = list.split(',');
//     if (parts[3]) {
//       let regex = /(오전|오후).+$/;
//       parts[3] = parts[3].replace(regex, '').trim();
//       text.push(parts);
//     } else {
//       text.push(parts);
//     }
//     const serializedParts = JSON.stringify(parts);
//     nSet.add(serializedParts);
//   }
// });

let text = [];

const arrayExists = (arr, target) => {
  for (let item of arr) {
    if (JSON.stringify(item) === JSON.stringify(target)) {
      return true;
    }
  }
  return false;
};

test.map((list) => {
  let idx = list.lastIndexOf('$');
  if (idx !== -1) {
    list = list.substring(idx + 1, list.length).trim();
    let parts = list.split(',');
    if (parts[3]) {
      let regex = /(오전|오후).+$/;
      parts[3] = parts[3].replace(regex, '').trim();
    }
    if (!arrayExists(text, parts)) {
      text.push(parts);
    }
  }
});

console.log(text);
