const fs = require('fs').promises;
const nodePath = require('path');

const dirExists = async (path) => {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
};

const saveResults = async (data) => {
  const key = `file-tree_${Date.now()}`;
  const resultsDir = nodePath.join(__dirname, 'results');
  const resultsDirExists = await dirExists(resultsDir);
  if (!resultsDirExists){
    await fs.mkdir(resultsDir);
  }

  return fs.writeFile(nodePath.join(resultsDir, `${key}.json`), JSON.stringify(data, null, 2));
};

module.exports = {
  saveResults,
};
