import React from 'react';
import {WebView} from 'react-native-webview';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const WritingQuiz = ({quiz, onIncorrect, onCorrect}) => {
  const {question, answer} = quiz;
  const injectedJavaScript = `
  const writer = HanziWriter.create('character-target-div', '${answer}', {
    showCharacter: false,
    showOutline: false,
    drawingWidth: 30,
  });
  writer.quiz({
    onMistake: (stroke) => stroke.totalMistakes > 5 ? window.ReactNativeWebView.postMessage("incorrect") : undefined,
    onComplete: (summary) => window.ReactNativeWebView.postMessage("correct")
  });
  true;
  `;
  const html = `
  <div id="character-target-div" style="height:100%; margin: auto;"></div>
  <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@2.2/dist/hanzi-writer.min.js"></script>
  `;

  const onMessage = (e) => {
    if (e.nativeEvent.data === 'correct') {
      setTimeout(onCorrect, 1500);
    } else {
      onIncorrect();
    }
  };

  const windowWidth = useWindowDimensions().width;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 3,
      backgroundColor: '#fff',
    },
    testView: {
      flex: 18,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    web: {
      height: windowWidth - 20,
      width: windowWidth - 20,
      borderWidth: 7,
      borderRadius: 3,
      borderColor: '#f0f0f0',
      backgroundColor: 'blue',
    },
    btn: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      backgroundColor: '#f44336',
    },
    questionText: {
      fontSize: 40,
      padding: 10,
    },
    forgotText: {
      fontSize: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.testView}>
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.web} key={question}>
          <WebView
            originWhiteList={['*']}
            source={{html}}
            injectedJavaScript={injectedJavaScript}
            onMessage={onMessage}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onIncorrect}>
        <Text style={styles.forgotText}>Forgot</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WritingQuiz;
