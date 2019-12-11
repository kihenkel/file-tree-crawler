const fs = require('fs');

const getParam = require('./getParam');

const crawl = require('./fileTreeCrawler');
const args = process.argv.slice(2);
const ignored = getParam(['-i', '--ignore'], args).split(',');
const initialPath = args[0];

crawl(initialPath, ignored)
  .then(result => {
    const fileToWrite = `results/file-tree_${new Date().toISOString().substr(0, 19).replace(/[T\:]/g, '-')}.json`;
    fs.writeFileSync(fileToWrite, JSON.stringify(result, null, ' '), 'utf8');
  });

