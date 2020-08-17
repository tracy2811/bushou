import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import WritingQuiz from './WritingQuiz';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';

const Quiz = ({queue, setQueue, quiz, updateRadical, setHome, setLearning, connected}) => {
  const current = queue[0];
  const {no, box} = current.radical;
  const {prev} = current;
  const onCorrect = () => {
    const newQueue = [...queue];
    newQueue.shift();
    if (!box || prev) {
      updateRadical(no, 1);
    } else {
      updateRadical(no, box + 1);
    }
    if (!newQueue.length) {
      setHome(true);
      setLearning(false);
    }
    setQueue(newQueue);
  };
  const onIncorrect = () => {
    const newQueue = [...queue];
    newQueue[0].quiz = false;
    newQueue[0].prev = true;
    setQueue(newQueue);
  };
  const backHome = () => {
    setHome(true);
    setLearning(false);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHome);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHome);
  }, []);

  if (connected && Math.random() < 0.3) {
    const quiz = {
      question: current.radical.meaning,
      answer: current.radical.radical[0],
    };
    return (
      <WritingQuiz
        quiz={quiz}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  } else {
    return (
      <MultipleChoiceQuiz
        quiz={quiz}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  }
};

export default Quiz;
