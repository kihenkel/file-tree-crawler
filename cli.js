const getParam = require('./getParam');

const crawl = require('./fileTreeCrawler');
const { saveResults } = require('./file');
const args = process.argv.slice(2);
const ignored = getParam(['-i', '--ignore'], args).split(',');
const flatMap = getParam(['-f', '--flat'], args, true);
const fileMask = getParam(['-m', '--mask', '--fileMask'], args);
const initialPath = args[0];

crawl(initialPath, { ignored, flatMap, fileMask })
  .then(result => {
    return saveResults(result);
  });

