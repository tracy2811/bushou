const radicals = require('./radicals.json');
const fs = require('fs');

let text = 'const img = {';
radicals.forEach((r) => {
  const name = encodeURI(r.radical[0]);
  const order = encodeURI(r.order);
  text += `'${name}': {order: require('./${order}'), glyphOrigin: [`;
  fs.copyFile(`./img/${r.order}`, `./img-encode/${order}`, (err) => {
    if (err) {
      console.error(err);
    }
  });
  r.glyphOrigin.forEach((o) => {
    const origin = encodeURI(o);
    text += `require('./${origin}'),`;
    fs.copyFile(`./img/${o}`, `./img-encode/${origin}`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
  text += ']},';
});

text += '}; export default img;';

fs.writeFile('./img-encode/index.js', text, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('index.js saved!');
  }
});
