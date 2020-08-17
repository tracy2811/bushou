import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SectionList,
  BackHandler,
} from 'react-native';
import img from '../img-encode/';
import Icon from 'react-native-vector-icons/FontAwesome';

const RadicalBasic = ({radical}) => {
  const [shown, setShown] = useState(false);
  const onPress = () => setShown(!shown);
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <View style={styles.row}>
        <View>
          <Text
            style={
              radical.box
                ? [styles.largeText, styles.boldText]
                : [styles.largeText, styles.inactiveText, styles.boldText]
            }>
            {radical.radical.join('、')}
          </Text>
          <Text
            style={
              radical.box
                ? styles.normalText
                : [styles.normalText, styles.inactiveText]
            }>
            {radical.pinyin}
          </Text>
        </View>
        <View>
          <Text
            style={
              radical.box
                ? [styles.largeText, styles.textRight]
                : [styles.largeText, styles.textRight, styles.inactiveText]
            }>
            {radical.meaning}
          </Text>
          <Text
            style={
              radical.box
                ? [styles.normalText, styles.textRight]
                : [styles.normalText, styles.textRight, styles.inactiveText]
            }>
            {radical.hanViet}
          </Text>
        </View>
      </View>
      {shown && (
        <>
          <Text
            style={
              radical.box ? styles.note : [styles.note, styles.inactiveText]
            }>
            {radical.note}
          </Text>
          <Image style={styles.img} source={img[encodeURI(radical.radical[0])].order} />
        </>
      )}
    </TouchableOpacity>
  );
};

const RadicalsList = ({radicals, setHome, setLearning, learnAvailable}) => {
  const renderItem = ({item}) => <RadicalBasic radical={item} />;
  const renderSectionHeader = ({section: {title}}) => (
    <Text style={styles.sectionText}>#{title}</Text>
  );
  const basics = radicals.reduce((acc, r) => {
    const {
      no,
      radical,
      meaning,
      hanViet,
      order,
      note,
      pinyin,
      box,
      strokeCount,
    } = r;
    const group = acc.find((v) => v.title === strokeCount);
    if (group) {
      group.data.push({
        no,
        radical,
        meaning,
        hanViet,
        order,
        note,
        pinyin,
        box,
      });
    } else {
      acc.push({
        title: strokeCount,
        data: [
          {
            no,
            radical,
            meaning,
            hanViet,
            order,
            note,
            pinyin,
            box,
          },
        ],
      });
    }
    return acc;
  }, []);
  const onPressBack = () => {
    setHome(true);
    setLearning(false);
    return true;
  };
  const onPressLearn = () => {
    if (learnAvailable) {
      setHome(false);
      setLearning(true);
    }
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onPressBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onPressBack);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressBack}>
          <Icon name="arrow-left" size={38} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Kangxi Radicals</Text>
      </View>
      <View style={styles.body}>
        <SectionList
          sections={basics}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(radical) => `${radical.no}`}
        />
      </View>
      <TouchableOpacity style={styles.footer} onPress={onPressLearn}>
        <Text style={styles.learnText}>{learnAvailable ? 'Start' : "You've learnt them all!"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7a03',
    paddingHorizontal: 10,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 38,
    borderRadius: 3,
  },
  boldText: {
    fontWeight: 'bold',
  },
  body: {
    flex: 16,
    justifyContent: 'space-between',
    paddingBottom: 5,
    padding: 3,
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff7a03',
    borderRadius: 3,
    margin: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textRight: {
    textAlign: 'right',
  },
  img: {
    alignSelf: 'center',
  },
  note: {
    textAlign: 'justify',
    fontSize: 16,
    marginTop: 5,
  },
  inactiveText: {
    color: '#888',
  },
  learnText: {
    fontSize: 28,
  },
  itemContainer: {
    padding: 5,
    borderRadius: 3,
    borderWidth: 3,
    borderColor: '#f2f2f2',
  },
  largeText: {
    fontSize: 24,
    color: '#000',
  },
  normalText: {
    fontSize: 16,
    color: '#000',
  },
  sectionText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 26,
    marginTop: 24,
    marginBottom: 6,
  },
});

export default RadicalsList;
