const radicals = require('./radicals.json');
const fs = require('fs');

let text = 'const img = {';
radicals.forEach((r) => {
  text += `${r.radical[0]}: {order: require('./${r.order}'), glyphOrigin: [`;
  r.glyphOrigin.forEach((o) => {
    text += `require('./${o}'),`;
  });
  text += ']},';
});

text += '}; export default img;';

fs.writeFile('./img/index.js', text, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('index.js saved!');
  }
});
