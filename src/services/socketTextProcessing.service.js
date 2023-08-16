const arrayExists = (arr, target) => {
  for (let item of arr) {
    if (JSON.stringify(item) === JSON.stringify(target)) {
      return true;
    }
  }
  return false;
};

const getLastIndexOfDollarSign = (input) => {
  return input.lastIndexOf('$');
};

const extractSublistFromIndexToEnd = (input, startIndex) => {
  return input.substring(startIndex + 1, input.length).trim();
};

const removeTimeInfo = (input) => {
  let regex = /(오전|오후).+$/;
  return input.replace(regex, '').trim();
};

module.exports = {
  getLastIndexOfDollarSign,
  extractSublistFromIndexToEnd,
  removeTimeInfo,
  arrayExists,
};
