const fs = require('fs');
const path = require('path')

const isEqual = require('lodash.isequal');
const emojiList = require('emojis-list');

const args = process.argv;

const DIR = path.dirname('./');
const DIR_SRC = path.resolve(DIR, args[2]);
const DIR_DEST = path.resolve(DIR, args[3]);

const CUT = args[4] === 'cut';

const SPECIAL_SYMBOLS = [0xFE0F, 0x200D];

const emojiUnicodePoints = emojiList.map((code) => [...code].map((point) => point.codePointAt(0)));

const convertFiles = function() {
  return fs.readdir(DIR_SRC, (err, files) => {
    console.time('Converted in')
    files.forEach(file => {
      const [name, ext] = file.split('.'); // '1f3c3-1f3ff-2642.png' -> ['1f3c3-1f3ff-2642', '.png']
      if (!name || !ext) return;

      const points = name
        .split('-') // '1f3c3-1f3ff-2642' -> ['1f3c3', '1f3ff', '2642']
        .map(code => parseInt(code, 16)) // ['1f3c3', '1f3ff', '2642'] -> [127939, 127999, 9794]
        .filter((code) => !SPECIAL_SYMBOLS.includes(code)); // [127939, 127999, 9794]

      const equal = (codes) => isEqual(codes, points);

      const filtredEmojis = emojiUnicodePoints // [..., [127939, 127999, 8205, 9794, 65039], ...]
        // [..., [127939, 127999, 9794], ...]
        .filter((codes) => equal(codes.filter((code) => !SPECIAL_SYMBOLS.includes(code))))

      if (filtredEmojis.length === 1) {
        copy(file, filtredEmojis[0])
      } else {
        console.log(`Not supported in Emoji 12.0 or something went wrong with: ${file}`)
      }
    });

    emojiUnicodePoints.forEach((emojiCode) => {
      const emoji = String.fromCodePoint(...emojiCode)
      const exist = fs.existsSync(`${DIR_DEST}/${emoji}.png`)

      if (!exist) {
        console.log(`Not found file for emoji: ${emoji}`)
      }
    })

    console.timeEnd('Converted in')
  });
};

function copy(file, pointsEmoji) {
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

convertFiles();