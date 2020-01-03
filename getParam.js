module.exports = (flags, argumentList, flagOnly) => {
  if (!flags.some(flag => argumentList.includes(flag))) {
    return flagOnly ? false : '';
  }
  
  if (flagOnly) {
    return true;
  }

  const flagIndex = argumentList.findIndex((arg) => flags.includes(arg));
  return argumentList[flagIndex + 1];
};
