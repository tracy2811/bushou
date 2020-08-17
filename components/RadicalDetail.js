import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import img from '../img/';

const RadicalDetail = ({queue, setQueue, setHome, setLearning}) => {
  const [orderShown, setOrderShown] = useState(true);
  const showOrder = () => setOrderShown(true);
  const showOrigin = () => setOrderShown(false);
  const onPressGood = () => {
    const newQueue = [...queue];
    newQueue.push({
      radical: queue[0].radical,
      quiz: true,
      prev: queue[0].prev,
    });
    newQueue.shift();
    setQueue(newQueue);
  };
  const radical = queue[0].radical;
  const backHome = () => {
    setHome(true);
    setLearning(false);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHome);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHome);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.chineseHeader}>
          <Text style={[styles.headerText, styles.boldText]}>
            {radical.radical[0]}
          </Text>
          <Text style={styles.normalText}>{radical.pinyin}</Text>
        </View>
        <View style={styles.meaningHeader}>
          <Text style={[styles.headerText, styles.textRight]}>
            {radical.meaning}
          </Text>
          <Text style={[styles.normalText, styles.textRight]}>
            {radical.hanViet}
          </Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        {radical.radical.length > 1 && (
          <Text style={styles.normalText}>
            Alternatives:{'  '}
            <Text style={styles.boldText}>
              {radical.radical.slice(1).join('、')}
            </Text>
          </Text>
        )}
        {radical.simplified && (
          <Text style={styles.normalText}>
            Simplified:{'     '}
            <Text style={styles.boldText}>{radical.simplified}</Text>
          </Text>
        )}
        <Text style={styles.normalText}>
          Stroke count: {radical.strokeCount}
        </Text>
        <Text style={styles.normalText}>
          Frequency:{'     '}
          {radical.frequency}
        </Text>
        <Text style={styles.normalText}>
          Examples:{'      '}
          <Text style={styles.boldText}>{radical.examples.join('、')}</Text>
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={showOrder}>
            <Text style={orderShown ? styles.activeText : styles.inActiveText}>
              Stroke order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.left} onPress={showOrigin}>
            <Text style={orderShown ? styles.inActiveText : styles.activeText}>
              Glyph origin
            </Text>
          </TouchableOpacity>
        </View>
        {orderShown && (
          <View style={styles.center}>
            <Image
              source={img[encodeURI(radical.radical[0])].order}
              style={{flex: 1}}
            />
          </View>
        )}
        {!orderShown && (
          <ScrollView>
            {!!radical.note && (
              <Text style={[styles.textJustify, styles.normalText]}>
                {radical.note}
              </Text>
            )}
            <View style={styles.imgContainer}>
              {img[encodeURI(radical.radical[0])].glyphOrigin.map(
                (source, i) => (
                  <Image source={source} key={i} />
                ),
              )}
            </View>
          </ScrollView>
        )}
      </View>
      <TouchableOpacity style={styles.footerContainer} onPress={onPressGood}>
        <Text style={styles.largeText}>Good</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingTop: 10,
  },
  chineseHeader: {
    flex: 1,
  },
  meaningHeader: {
    flex: 5,
  },
  detailContainer: {
    flex: 15,
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  footerContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1bbf00',
    borderRadius: 3,
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop: 13,
    marginBottom: 7,
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    marginLeft: 30,
  },
  textRight: {
    textAlign: 'right',
  },
  textJustify: {
    textAlign: 'justify',
  },
  largeText: {
    fontSize: 28,
    color: '#000',
  },
  normalText: {
    fontSize: 20,
    color: '#000',
  },
  inActiveText: {
    fontSize: 19,
    color: '#828282',
  },
  headerText: {
    fontSize: 40,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  activeText: {
    color: '#000',
    fontSize: 21,
  },
});

export default RadicalDetail;
