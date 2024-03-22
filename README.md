# file-tree-crawler
A Node.js application that recursively crawls through folders of your choice and generates a JSON file of your file tree.

## How to use
You can use the file-tree-crawler in two ways:
1. As a standalone application using `cli.js`
2. As an npm package as part of your application

### Usage as standalone application (`cli.js`)
You can execute the standalone application using node and `cli.js`.
Generated JSON files will be saved in a `results` folder.

#### Flags
| Flag(s)  | Description |
|-----------|------- |
| -i, --ignored   | Ignore files/dirs with name (separated by commas)|
| -f, --flat   | Return flattened map (instead of file tree) |
| -m, --mask, --fileMask  | File mask (regex) |

#### Examples
`node ./cli.js "path/to/folder"`

`node ./cli.js "path/to/folder" -f`

`node ./cli.js "path/to/folder" -i ".git,.github,.gradle,.idea,.settings,node_modules,WEB-INF"`

`node ./cli.js "path/to/folder" -i ".git,.github,.gradle,.idea,.settings,node_modules,WEB-INF" -f -m ".+Test.js.?$"`


### Usage as npm package
Just include the npm package as you would usually do it.
```javascript
const fileTreeCrawler = require('file-tree-crawler');
fileTreeCrawler('path/to/folder/', options);
```

#### Options
| Property  | Type          | Default | Description                                                             |
|-----------|-------        |---      | -------------                                                            |
| ignored   | Array[String] | `[]`      | An array of file/folder names that should be ignored (full name match)  |
| flatMap   | Boolean       | `false`   | If `true` it will output the file tree as a flat array. Might be useful in some cases.  |
| fileMask  | String        | `''`      | Must be a valid regex string. Will be converted to native JS `RegExp`. It will only pick *files* that match that regex (folder names will not be matched) |



