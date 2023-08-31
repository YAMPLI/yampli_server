let text = [];

const arrayExists = (arr, target) => {
  for (let item of arr) {
    if (JSON.stringify(item) === JSON.stringify(target)) {
      return true;
    }
  }
  return false;
};

const textData = (test) => {
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
  return text;
};

module.exports = {
  textData,
};
