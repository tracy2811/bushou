import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({length, text, setHome, setLearning, learnAvailable}) => {
  const [showInfo, setShowInfo] = useState(false);
  const onPressLearn = () => {
    if (learnAvailable) {
      setHome(false);
      setLearning(true);
    }
  };
  const onPressRadicals = () => {
    setHome(false);
    setLearning(false);
    setShowInfo(false);
  };
  const onPressInfo = () => {
    setShowInfo(!showInfo);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressInfo}>
          <Icon name="info" size={38} />
        </TouchableOpacity>
        <Text style={styles.brand}>BuShou</Text>
      </View>
      {showInfo && (
        <TouchableOpacity style={styles.info} onPress={onPressInfo}>
          <Text style={styles.infoText}>
            Master Kangxi radicals and their Glyph origin with spaced repetition
            method.
          </Text>
          <Text style={styles.infoText}>
            Writing quiz only available when Internet connected!
          </Text>
          <Text
            style={styles.devText}
            onPress={() =>
              Linking.openURL(
                'mailto:trangnguyen.281198@gmail.com?subject=BuShu%20Feedback',
              )
            }>
            <Icon name="envelope-open" size={18} /> trangnguyen.281198@gmail.com
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={showInfo ? styles.bodySmall : styles.body}
        onPress={onPressRadicals}>
        <Text style={styles.mainText}>You've learnt {length}/214</Text>
        {!!text && <Text style={styles.noteText}>{text}</Text>}
        <Text style={styles.noteText}>Tap to see more</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footer}
        onPress={learnAvailable ? onPressLearn : undefined}>
        <Text style={styles.learnText}>
          {learnAvailable ? 'Start' : 'Remember to review them later!'}
        </Text>
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
  brand: {
    flex: 1,
    textAlign: 'center',
    fontSize: 40,
  },
  body: {
    flex: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  bodySmall: {
    flex: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  info: {
    flex: 4,
    backgroundColor: '#ffb855',
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 18,
    padding: 3,
    textAlign: 'justify',
  },
  devText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 2,
  },
  mainText: {
    fontSize: 38,
  },
  noteText: {
    fontSize: 22,
    color: '#000',
  },
  learnText: {
    fontSize: 28,
    color: '#000',
  },
});

export default Home;
