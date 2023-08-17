const arrayExists = (arr, target) => {
  for (let item of arr) {
    if (JSON.stringify(item) === JSON.stringify(target)) {
      return true;
    }
  }
  return false;
};

const getLastIndexOfDollarSign = (input) => {
  return input.lastIndexOf('&');
};

const extractSublistFromIndexToEnd = (input, startIndex) => {
  return input.substring(startIndex + 1, input.length).trim();
};

const removeTimeInfo = (input) => {
  let regex = /(오전|오후|이후).+$/;
  let regex1 = /(오전|오후|2후)?\s*(\d+)(?::\d+)?.+$/;
  return input.replace(regex1, '').trim();
};

module.exports = {
  getLastIndexOfDollarSign,
  extractSublistFromIndexToEnd,
  removeTimeInfo,
  arrayExists,
};
