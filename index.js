const util = require('util');
const fs = require('fs');
const path = require('path');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

const getParam = require('./getParam');

const args = process.argv.slice(2);
const ignored = getParam(['-i', '--ignore'], args).split(',');
const initialPath = args[0];

const getFileInfo = (fileStat, fileName, fullPath) => {
  return {
    type: fileStat.isDirectory() ? 'dir' : 'file',
    size: fileStat.size,
    name: fileName,
    fullPath,
    createdAt: new Date(fileStat.birthtime).toISOString(),
    modifiedAt: new Date(fileStat.mtime).toISOString(),
  };
};

const parseFileInfosToFileTree = async (dirPath, fileNames) => {
  const promises = fileNames.map(async fileName => {
    const newPath = path.join(dirPath, fileName);
    const fileStat = await stat(newPath);
    if (!fileStat.isDirectory()) {
      return getFileInfo(fileStat, fileName, newPath);
    }
    const childrenFiles = await readdir(newPath);
    const filteredChildrenFiles = childrenFiles.filter(fileName => !ignored.includes(fileName));
    const children = await parseFileInfosToFileTree(newPath, filteredChildrenFiles);
    return {
      ...getFileInfo(fileStat, fileName, newPath),
      children
    };
  })

  const fileInfos = await Promise.all(promises);
  return fileInfos.reduce((acc, fileInfo) => ([
    ...acc,
    fileInfo
  ]), []);
};

readdir(initialPath)
  .then(fileNames => fileNames.filter(fileName => !ignored.includes(fileName)))
  .then(fileNames => parseFileInfosToFileTree(initialPath, fileNames))
  .then(fileTree => {
    return { initialPath, children: fileTree };
  });

