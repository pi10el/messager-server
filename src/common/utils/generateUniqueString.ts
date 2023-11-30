export const generateUniqueString = () => {
  const string = 'qwertyuiopasdfghjklzxcvbnm';
  const arrString = [];
  const result = [];

  const date = Date.now()
    .toString()
    .match(/(.{1,4})/gim)
    ?.slice(0, -1) as string[];

  while (arrString.length < date.length) {
    arrString.push(string[Math.floor(Math.random() * string.length)]);
  }

  for (let i = 0; i < date.length; i++) {
    const el = `${date[i]}${arrString[i]}`;
    result.push(el);
  }
  return result.join('');
};
