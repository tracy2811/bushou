import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Option = ({correct, text, onCorrect, onIncorrect}) => {
  const [pressed, setPressed] = useState(false);
  const onPress = () => {
    setPressed(true);
    setTimeout(() => {
      if (correct) {
        onCorrect();
      } else {
        onIncorrect();
      }
    }, 500);
  };
  const pressedStyle = correct
    ? [styles.opt, styles.correct]
    : [styles.opt, styles.incorrect];
  return (
    <TouchableOpacity
      style={pressed ? pressedStyle : styles.opt}
      onPress={onPress}>
      <Text style={styles.normalText}>{text}</Text>
    </TouchableOpacity>
  );
};

const MultipleChoiceQuiz = ({onCorrect, onIncorrect, quiz}) => {
  return (
    <View style={styles.container}>
      <View style={styles.ques}>
        <Text style={styles.questionText}>{quiz.question}</Text>
      </View>
      <View style={styles.optContainer}>
        <View style={styles.row}>
          <Option
            correct={quiz.options[0] === quiz.answer}
            text={quiz.options[0]}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
            key={quiz.options[0]}
          />
          <Option
            correct={quiz.options[1] === quiz.answer}
            text={quiz.options[1]}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
            key={quiz.options[1]}
          />
        </View>
        <View style={styles.row}>
          <Option
            correct={quiz.options[2] === quiz.answer}
            text={quiz.options[2]}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
            key={quiz.options[2]}
          />
          <Option
            correct={quiz.options[3] === quiz.answer}
            text={quiz.options[3]}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
            key={quiz.options[3]}
          />
        </View>
        <TouchableOpacity style={styles.forgotBtn} onPress={onIncorrect}>
          <Text style={styles.normalText}>Forgot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ques: {
    flex: 3,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  optContainer: {
    flex: 2,
  },
  row: {
    flex: 3,
    flexDirection: 'row',
    marginBottom: 3,
    marginHorizontal: 1,
  },
  opt: {
    flex: 1,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#87ceeb',
  },
  normalText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 24,
  },
  questionText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 60,
  },
  forgotBtn: {
    flex: 2,
    margin: 3,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    borderRadius: 3,
  },
  correct: {
    backgroundColor: '#1bbf00',
  },
  incorrect: {
    backgroundColor: '#f44336',
  },
});

export default MultipleChoiceQuiz;
