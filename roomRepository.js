const IdLength = 2;

const setLetterArray = () => {
  const ascii = [];

  for (let i = 48; i <= 122; i++) {
    if ((i > 57 && i < 65) || (i > 90 && i < 97)) continue;
    ascii.push(String.fromCharCode(i));
  }
  return ascii;
};
/**
 *
 * @param {arrays} arr 이미 존재하는 ID가 저장된 배열
 * @returns {string} new ID
 */
const newID = () => {
  const ascii = setLetterArray();
  let id = "";
  for (let i = 0; i < IdLength; i++) {
    const rnd = Math.random() * ascii.length;
    const idx = Math.floor(rnd);
    id += ascii[idx];
  }
  return id;
};
const checkIdOverflow = (arr = []) => {
  const MAX = setLetterArray().length;
  if (arr.length === MAX ** IdLength) {
    return true;
  } else {
    return false;
  }
};
export const setID = (arr = []) => {
  if (checkIdOverflow(arr)) return -1;
  let currentID = newID();
  while (arr.includes(currentID)) {
    // console.log(`아이디 중복: ${currentID}`);
    currentID = newID();
  }
  console.log(currentID, arr.length);
  return currentID;
};

export const updateUserlist = (arr = [], newItem) => {
  if (arr.includes(newItem)) return arr;
  const beforeSet = [];
  arr.forEach((item) => {
    beforeSet.push(item);
  });
  beforeSet.push(newItem);
  const tmpSet = new Set(beforeSet);
  const afterSet = [];
  tmpSet.forEach((item) => {
    afterSet.push(item);
  });
  return afterSet;
};
