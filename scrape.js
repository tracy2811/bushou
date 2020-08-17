const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const saveImage = (url, name) => {
  axios({
    url,
    responseType: 'stream',
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(`img/${name}`))
          .on('finish', () => resolve())
          .on('error', (e) => reject(e));
      }),
  );
};

const cleanText = (text) =>
  text
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\\n/g, ' ')
    .trim();

const scrape = async () => {
  try {
    const url = 'https://en.wikipedia.org/wiki/Kangxi_radical';
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const rows = $('table:nth-of-type(3) > tbody > tr');
    const radicals = [];

    // Get basics
    rows.each((_, v) => {
      const getText = (i) =>
        cleanText($(v).find(`td:nth-of-type(${i})`).text());
      const getNumber = (i) => +getText(i).replace(/,/g, '');
      const getChineseText = (i) =>
        $(v).find(`td:nth-of-type(${i}) span`).text().replace(/[、\s]/g, '');
      radicals.push({
        no: +getText(1),
        radical: [...getChineseText(2)],
        strokeCount: +getNumber(3),
        meaning: getText(4),
        pinyin: getText(5),
        hanViet: getText(6),
        frequency: getNumber(9),
        simplified: getText(10).length ? getText(10) : undefined,
        examples: [...getChineseText(11)],
      });
    });
    radicals.shift();

    // Scape Image
    await Promise.all(
      radicals.map(async (r, i) => {
        const encoded = encodeURIComponent(r.radical[0]);
        const res = await axios.all([
          axios.get(`https://en.wiktionary.org/wiki/${encoded}`),
          axios.get(
            `https://commons.wikimedia.org/wiki/File:${encoded}-order.gif`,
          ),
        ]);

        // Get glyphOrigin
        const h3 = cheerio
          .load(res[0].data)('[id^="Glyph_origin"]')
          .first()
          .parent();
        const glyphOrigin = [];
        h3.nextUntil('h3', 'table')
          .first()
          .find('tbody > tr:not(.vsHide) > td > a > img')
          .each(async (_, v) => {
            const src = $(v).attr('src');
            const name = src.split('/').pop();
            const url = `https:${src}`;
            glyphOrigin.push(name);
            saveImage(url, name);
          });

        // Get node
        const note = cleanText(h3.nextUntil('h3', 'p').text());

        // Get order
        const orderURL = cheerio
          .load(res[1].data)('img[src$="-order.gif"]')
          .attr('src');
        const order = orderURL.split('/').pop();
        saveImage(orderURL, order);
        r.order = order;
        r.glyphOrigin = glyphOrigin;
        r.note = note;
        return {order, glyphOrigin, note};
      }),
    );
    return radicals;
  } catch (err) {
    console.error(err);
  }
};

const generateImageIndex = (radicals) => {
  let text = 'const img = {';
  radicals.forEach((r) => {
    const name = encodeURIComponent(r.radical[0]);
    text += `'${name}': {order: require('./${r.order}'), glyphOrigin: [`;
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
      console.log('Generate img/index.js');
    }
  });
};

const generateJSON = (radicals) => {
  fs.writeFile('radicals.json', JSON.stringify(radicals), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Generate radicals.json');
    }
  });
};

scrape().then((r) => {
  generateImageIndex(r);
  generateJSON(r);
});
