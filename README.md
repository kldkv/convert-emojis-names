# convert-emojis-names

Convert filenames for popular emojis pack from '1f44b-1f3fe.png' to '👋🏾.png'

### motivation
Why convert emoji on the client or search for emoji in the hashmap when you can immediately get name a picture by emoji unicode?

### limitation
Files will be renamed if present in the standard and supported by the [emojis-list](https://github.com/Kikobeats/emojis-list). Now it's Emoji 12.0. [Unicode](https://unicode.org/emoji/charts/)/[emojipedia](https://emojipedia.org/emoji-12.0/)

### checked
This package was tested on:
- [JoyPixels](https://www.joypixels.com/)
- [OpenMoji](https://www.openmoji.org/)
- [Twemoji](https://twemoji.twitter.com/)

### usase
```
npx convert-emojis-names input-dir output-dir
```

### example
```
1f600.png -> 😀.png
1f469-1f3fc-1f91d-1f468-1f3fe.png -> 👩🏼‍🤝‍👨🏾.png
```
