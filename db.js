import Realm from 'realm';
const radicals = require('./radicals.json');

const RadicalSchema = {
  name: 'Radical',
  primaryKey: 'no',
  properties: {
    no: 'int',
    radical: 'string[]',
    strokeCount: 'int',
    meaning: 'string',
    pinyin: 'string',
    hanViet: 'string',
    frequency: 'int',
    simplified: 'string?',
    examples: 'string[]',
    order: 'string',
    glyphOrigin: 'string[]',
    note: 'string?',
    box: 'int?',
    deadline: 'date?',
  },
};

const realm = new Realm({schema: [RadicalSchema]});
if (realm.objects('Radical').length !== 214) {
  realm.write(() => realm.deleteAll());
  radicals.forEach((r) => realm.write(() => realm.create('Radical', r)));
}

const getAllRadicals = () => realm.objects('Radical');
const getToLearnRadicals = () => {
  const newRadicals = realm
    .objects('Radical')
    .sorted('frequency', true)
    .filtered('box == nil LIMIT(5)');
  const oldRadicals = realm
    .objects('Radical')
    .filtered('deadline <= $0', new Date());
  const toLearnRadicals = [];
  newRadicals.forEach((radical) =>
    toLearnRadicals.push({
      radical,
      quiz: radical.box ? true : false,
      prev: false,
    }),
  );
  oldRadicals.forEach((radical) =>
    toLearnRadicals.push({
      radical,
      quiz: radical.box ? true : false,
      prev: false,
    }),
  );
  return toLearnRadicals;
};
const getLearntInfo = () => {
  const learnt = realm.objects('Radical').filtered('box != nil');
  const length = learnt.length;
  let text = learnt
    .slice(0, 3)
    .map((r) => r.radical[0])
    .join('、');
  if (length > 3) {
    text += '、。。。';
  }
  return {length, text};
};
const updateRadical = (no, box) => {
  const getNewDeadline = (box) => {
    const today = Date.now();
    const day = 24 * 60 * 60 * 1000;
    if (box === 1) {
      return new Date(today + day);
    } else if (box === 2) {
      return new Date(today + day * 2);
    } else if (box === 5) {
      return new Date(today + day * 7);
    } else if (box === 4) {
      return new Date(today + day * 14);
    } else if (box === 5) {
      return new Date(today + day * 30);
    }
  };
  realm.write(() =>
    realm.create('Radical', {no, box, deadline: getNewDeadline(box)}, true),
  );
};

export {getAllRadicals, getLearntInfo, getToLearnRadicals, updateRadical};
