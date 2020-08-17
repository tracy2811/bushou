import React, {useState, useEffect} from 'react';
import Home from './components/Home';
import RadicalsList from './components/RadicalsList';
import RadicalDetail from './components/RadicalDetail';
import Quiz from './components/Quiz';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import {
  getAllRadicals,
  getLearntInfo,
  getToLearnRadicals,
  updateRadical,
} from './db';

// https://stackoverflow.com/a/2450976
const shuffle = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const App = () => {
  const [allRadicals, setAllRadicals] = useState([]);
  const [queue, setQueue] = useState([]);
  const [learning, setLearning] = useState(false);
  const [home, setHome] = useState(true);
  const [connected, setConnected] = useState(false);
  const getQuiz = () => {
    if (allRadicals.length !== 214 || !queue.length) {
      return;
    }
    const radical = queue[0].radical;
    const isGuessMeaning = Math.random() < 0.5;
    const answer = isGuessMeaning ? radical.meaning : radical.radical[0];
    const question = isGuessMeaning ? radical.radical[0] : radical.meaning;
    const options = [answer];
    for (let i = 0; i < 3; i++) {
      let option;
      do {
        const index = Math.floor(Math.random() * allRadicals.length);
        option = isGuessMeaning
          ? allRadicals[index].meaning
          : allRadicals[index].radical[0];
      } while (option === answer);
      options.push(option);
    }
    return {
      question,
      answer,
      options: shuffle(options),
    };
  };
  useEffect(() => {
    SplashScreen.hide();
    NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });
  }, []);
  useEffect(() => {
    if (queue.length) {
      return;
    }
    setAllRadicals(getAllRadicals());
    setQueue(shuffle(getToLearnRadicals()));
  }, [queue]);

  return (
    <>
      {home && (
        <Home
          length={getLearntInfo().length}
          text={getLearntInfo().text}
          setHome={setHome}
          setLearning={setLearning}
          learnAvailable={queue.length > 0}
        />
      )}
      {!home && !learning && (
        <RadicalsList
          radicals={allRadicals}
          setHome={setHome}
          setLearning={setLearning}
          learnAvailable={queue.length > 0}
        />
      )}
      {learning && queue.length && queue[0].quiz && (
        <Quiz
          queue={queue}
          setQueue={setQueue}
          quiz={getQuiz()}
          updateRadical={updateRadical}
          setHome={setHome}
          setLearning={setLearning}
          connected={connected}
        />
      )}
      {learning && queue.length && !queue[0].quiz && (
        <RadicalDetail
          queue={queue}
          setQueue={setQueue}
          setHome={setHome}
          setLearning={setLearning}
        />
      )}
    </>
  );
};

export default App;
