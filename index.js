const fs = require('fs');
const path = require('path')

const isEqual = require('lodash.isequal');
const emojiList = require('emojis-list');

const SPECIAL_SYMBOLS = [0xFE0F, 0x200D];
const args = process.argv;

const DIR_SRC = path.resolve('./', args[2]);
const DIR_DEST = path.resolve('./', args[3]);

const CUT = args[4] === 'cut';

const emojiUnicodePoints = emojiList.map((code) => [...code].map((point) => point.codePointAt(0)));
const omitSymbols = (code) => !SPECIAL_SYMBOLS.includes(code);

function main({DIR_SRC, DIR_DEST, CUT}) {  
  function convertFiles() {
    return fs.readdir(DIR_SRC, (err, files) => {
      console.time('Converted in')
      
      files.forEach(file => {
        const [name, ext] = file.split('.'); // '1f3c3-1f3ff-2642.png' -> ['1f3c3-1f3ff-2642', '.png']
        if (!name || !ext) return;

        const points = name
          .split('-') // '1f3c3-1f3ff-2642' -> ['1f3c3', '1f3ff', '2642']
          .map(code => parseInt(code, 16)) // ['1f3c3', '1f3ff', '2642'] -> [127939, 127999, 9794]
          .filter(omitSymbols); // [127939, 127999, 9794]

        const equal = (codes) => isEqual(codes, points);

        const filtredEmojis = emojiUnicodePoints // [..., [127939, 127999, 8205, 9794, 65039], ...]
          // [..., [127939, 127999, 9794], ...]
          .filter((codes) => equal(codes.filter(omitSymbols)))

        if (filtredEmojis.length === 1) {
          copy({file, pointsEmoji: filtredEmojis[0], DIR_SRC, DIR_DEST, CUT})
        } else {
          console.log(`Not supported in Emoji 12.0 or something went wrong with: ${file}`)
        }
      });

      emojiUnicodePoints.forEach((emojiCode) => {
        const emoji = String.fromCodePoint(...emojiCode)
        const fileName = `${DIR_DEST}/${emoji}`;
        const exist = fs.existsSync(`${fileName}.png`) || fs.existsSync(`${fileName}.svg`)

        if (!exist) {
          console.log(`Not found file for emoji: ${emoji}`)
        }
      })

      console.timeEnd('Converted in')
    });
  };
  
  function copy({file, pointsEmoji}) {
    const [name, ext] = file.split('.');

    const emoji = String.fromCodePoint(...pointsEmoji);
    const filePath = path.resolve(DIR_SRC, file);
    const emojiPath = path.resolve(DIR_DEST, `${emoji}.${ext}`)

    fs.copyFile(filePath, emojiPath, fs.constants.COPYFILE_EXCL, (err) => {
      if (err) {
        console.log({emoji, pointsEmoji})

        throw err;
      }

      if (CUT) {
        fs.unlinkSync(filePath)
      }
    });

    return;
  }

  convertFiles()
}

module.exports = {
  main
}