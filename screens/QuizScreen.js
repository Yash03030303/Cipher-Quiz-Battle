import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  ScrollView
} from 'react-native';
import { Audio } from 'expo-av';
import QuestionCard from '../components/QuestionCard';
import LifelineBar from '../components/LifelineBar';
import PrizeLadder from '../components/PrizeLadder';
import allQuestions from '../data/questions.json';

export default function QuizScreen({ navigation }) {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [used5050, setUsed5050] = useState(false);
  const [usedFlip, setUsedFlip] = useState(false);
  const [usedIds, setUsedIds] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState(['A','B','C','D']);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [ladderVisible, setLadderVisible] = useState(false);

  const [soundCorrect, setSoundCorrect] = useState();
  const [soundWrong, setSoundWrong] = useState();

  const intervalRef = useRef(null);

  // 1) Load and select questions
  useEffect(() => {
    const levels = { easy:[], medium:[], hard:[], jackpot:[] };
    allQuestions.forEach(q => levels[q.level]?.push(q));
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());
    const selection = [
      ...shuffle(levels.easy).slice(0,5),
      ...shuffle(levels.medium).slice(0,5),
      ...shuffle(levels.hard).slice(0,5),
      ...shuffle(levels.jackpot).slice(0,1),
    ];
    setQuizQuestions(selection);
    setUsedIds([selection[0].id]);
    setLoading(false);
  }, []);

  // 2) Load correct & wrong sounds
  useEffect(() => {
    const loadSounds = async () => {
      const corr = new Audio.Sound();
      const wrong = new Audio.Sound();
      await corr.loadAsync(require('../assets/correct.mp3'));
      await wrong.loadAsync(require('../assets/wrong.mp3'));
      setSoundCorrect(corr);
      setSoundWrong(wrong);
    };
    loadSounds();
    return () => {
      soundCorrect?.unloadAsync();
      soundWrong?.unloadAsync();
    };
  }, []);

  // 3) Timer logic, reset timer and options on question change
  useEffect(() => {
    if (!quizQuestions.length) return;
    clearInterval(intervalRef.current);

    const level = quizQuestions[index].level;
    const limit = level === 'easy'   ? 15
                 : level === 'medium' ? 20
                 : level === 'hard'   ? 30
                 : 0; // jackpot unlimited

    setTimer(limit);
    setVisibleOptions(['A','B','C','D']);
    // <-- no resetting of used5050 or usedFlip here

    if (limit > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(intervalRef.current);
            onTimeout();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [index, quizQuestions]);

  const getAmount = i => {
    const ladder = [
      '1K','2K','3K','5K','10K',
      '20K','40K','80K','1.6L','3.2L',
      '6.4L','12.5L','25L','50L','1Cr','1Cr'
    ];
    return ladder[i]||'0';
  };

  const onTimeout = () => {
    soundWrong?.replayAsync();
    Alert.alert("Time's up!", "You ran out of time.", [
      { text:"OK", onPress: () =>
        navigation.replace('Result',{ won:false, amount:getAmount(index-1) })
      }
    ]);
  };

  // 4) Answer handler
  const handleSelect = key => {
    clearInterval(intervalRef.current);
    const correctKey = quizQuestions[index].answer;
    if (key === correctKey) {
      soundCorrect?.replayAsync();
      if (index+1 < quizQuestions.length) {
        setUsedIds(u => [...u, quizQuestions[index+1].id]);
        setIndex(i => i+1);
      } else {
        navigation.replace('Result',{ won:true, amount:'1Cr' });
      }
    } else {
      soundWrong?.replayAsync();
      navigation.replace('Result',{ won:false, amount:getAmount(index-1) });
    }
  };

  // 5) Leave game
  const onLeave = () => {
    clearInterval(intervalRef.current);
    navigation.replace('Result',{ won:true, amount:getAmount(index-1) });
  };

  // 6) 50:50 lifeline: remove 2 wrong options
  const useFiftyFifty = () => {
    if (used5050) return;
    const { options, answer } = quizQuestions[index];
    const wrongs = Object.keys(options).filter(k=>k!==answer);
    const randomWrongs = wrongs.sort(()=>0.5 - Math.random()).slice(0,2);
    setVisibleOptions([answer, ...randomWrongs]);
    setUsed5050(true);
  };

  // 7) Flip lifeline: swap in new same-level question
  const useFlipQuestion = () => {
    if (usedFlip) return;
    const current = quizQuestions[index];
    const pool = allQuestions.filter(q=>
      q.level===current.level && !usedIds.includes(q.id)
    );
    if (!pool.length) {
      Alert.alert("No flips left","You've seen all in this level.");
      return;
    }
    const next = pool[Math.floor(Math.random()*pool.length)];
    const copy = [...quizQuestions];
    copy[index] = next;
    setQuizQuestions(copy);
    setUsedIds(ids=>[...ids,next.id]);
    setVisibleOptions(['A','B','C','D']);
    setUsedFlip(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large"/>
        <Text>Loading questions…</Text>
      </View>
    );
  }

  const level = quizQuestions[index].level;
  const bgColor = {
    easy:    '#e0ffe0',
    medium:  '#fffbd1',
    hard:    '#ffe0e0',
    jackpot: '#f3e0ff'
  }[level]||'#fff';

  return (
    <View style={[styles.container,{backgroundColor:bgColor}]}>
      {/* Ladder Modal */}
      <Modal visible={ladderVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Prize Ladder</Text>
            <ScrollView style={{height:300}}>
              <PrizeLadder currentIndex={index}/>
            </ScrollView>
            <Button title="Close" onPress={()=>setLadderVisible(false)}/>
          </View>
        </View>
      </Modal>

      <Text style={styles.header}>₹{getAmount(index)} • Q{index+1}</Text>
      <Text style={styles.timer}>
        {level!=='jackpot' ? `⏱ ${timer}s` : '🎯 Jackpot!' }
      </Text>
      <Button title="🏆 Show Ladder" onPress={()=>setLadderVisible(true)}/>

      <QuestionCard
        questionObj={quizQuestions[index]}
        onSelect={handleSelect}
        visibleOptions={visibleOptions}
      />

      <LifelineBar
        onFiftyFifty={useFiftyFifty}
        onFlipQuestion={useFlipQuestion}
        used5050={used5050}
        usedFlip={usedFlip}
      />

      <Button title="🚪 Leave Game" onPress={onLeave} color="#d9534f"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, paddingTop:40 },
  header:    { textAlign:'center', fontSize:18, fontWeight:'bold' },
  timer:     { textAlign:'center', fontSize:16, color:'#d00', marginVertical:8 },
  loader:    { flex:1, justifyContent:'center', alignItems:'center' },
  modalOverlay: {
    flex:1, backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center', alignItems:'center'
  },
  modalContent: {
    width:'80%', backgroundColor:'#fff',
    borderRadius:8, padding:16, elevation:10
  },
  modalTitle: {
    fontSize:18, fontWeight:'bold', marginBottom:8, textAlign:'center'
  }
});
