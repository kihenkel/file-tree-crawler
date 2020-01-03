const util = require('util');
const fs = require('fs');
const path = require('path');
const defaultOptions = require('./defaultOptions');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

const flatTree = (files) => {
  return files.reduce((acc, file) => {
    if (file.children) {
      return [...acc, ...flatTree(file.children)];
    }
    return [...acc, file];
  }, []);
};

const getOptions = (options) => {
  if (!options) {
    return defaultOptions;
  }
  return {
    ...defaultOptions,
    ...options,
  };
};

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

const parseFileInfosToFileTree = async (dirPath, fileNames, ignored, fileMaskRegex) => {
  const promises = fileNames.map(async fileName => {
    const newPath = path.join(dirPath, fileName);
    const fileStat = await stat(newPath);
    if (!fileStat.isDirectory()) {
      if (!fileMaskRegex.test(fileName)) {
        return Promise.resolve();
      }
      return getFileInfo(fileStat, fileName, newPath);
    }
    const childrenFiles = await readdir(newPath);
    const filteredChildrenFiles = childrenFiles.filter(fileName => !ignored.includes(fileName));
    const children = await parseFileInfosToFileTree(newPath, filteredChildrenFiles, ignored, fileMaskRegex);
    return {
      ...getFileInfo(fileStat, fileName, newPath),
      children
    };
  })

  const fileInfos = await Promise.all(promises);
  return fileInfos
    .filter(fileInfo => fileInfo)
    .reduce((acc, fileInfo) => ([
      ...acc,
      fileInfo
    ]), []);
};

const applyModifications = (fileTree, flatMap) => {
  let modifiedTree = fileTree;
  if (flatMap) {
    modifiedTree = flatTree(fileTree);
  }
  return modifiedTree;
};

module.exports = (initialPath, options) => {
  const { ignored, flatMap, fileMask } = getOptions(options);
  const fileMaskRegex = new RegExp(fileMask);
  return readdir(initialPath)
    .then(fileNames => fileNames.filter(fileName => !ignored.includes(fileName)))
    .then(fileNames => parseFileInfosToFileTree(initialPath, fileNames, ignored, fileMaskRegex))
    .then(fileTree => applyModifications(fileTree, flatMap))
    .then(fileTree => {
      return { initialPath, children: fileTree };
    });
};
