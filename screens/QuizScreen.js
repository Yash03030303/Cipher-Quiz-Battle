import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, Modal, ScrollView, Animated
} from 'react-native';
import { Audio } from 'expo-av';
import QuestionCard from '../components/QuestionCard';
import LifelineBar from '../components/LifelineBar';
import PrizeLadder from '../components/PrizeLadder';
import allQuestions from '../data/questions.json';

const LEVEL_ENDS = [4, 9, 14];
const LEVEL_LABELS = ['First', 'Second', 'Third'];
const SECURED_AMOUNTS = ['0', '10K', '3.2L', '1Cr'];

export default function QuizScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [used5050, setUsed5050] = useState(false);
  const [usedFlip, setUsedFlip] = useState(false);
  const [usedIds, setUsedIds] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState(['A','B','C','D']);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [ladderVisible, setLadderVisible] = useState(false);
  const [breakModal, setBreakModal] = useState(false);
  const [breakLevel, setBreakLevel] = useState(0);

  const [soundCorrect, setSoundCorrect] = useState();
  const [soundWrong, setSoundWrong] = useState();

  const intervalRef = useRef(null);
  const progress = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    const lvls = { easy:[], medium:[], hard:[], jackpot:[] };
    allQuestions.forEach(q => lvls[q.level]?.push(q));
    const shuffle = a => [...a].sort(()=>Math.random()-0.5);
    const sel = [
      ...shuffle(lvls.easy).slice(0,5),
      ...shuffle(lvls.medium).slice(0,5),
      ...shuffle(lvls.hard).slice(0,5),
      ...shuffle(lvls.jackpot).slice(0,1)
    ];
    setQuestions(sel);
    setUsedIds([sel[0].id]);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const c = new Audio.Sound(), w = new Audio.Sound();
      await c.loadAsync(require('../assets/correct.mp3'));
      await w.loadAsync(require('../assets/wrong.mp3'));
      setSoundCorrect(c); setSoundWrong(w);
    })();
    return () => {
      soundCorrect?.unloadAsync();
      soundWrong?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    clearInterval(intervalRef.current);

    const lvl = questions[idx].level;
    const limit = lvl === 'easy' ? 25 : lvl === 'medium' ? 35 : lvl === 'hard' ? 45 : 0;
    setTimer(limit);
    setVisibleOptions(['A','B','C','D']);
    progress.setValue(100);

    if (limit > 0) {
      Animated.timing(progress, {
        toValue: 0,
        duration: limit * 1000,
        useNativeDriver: false
      }).start();

      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t === 1) {
            clearInterval(intervalRef.current);
            onTimeout();
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [idx, questions]);

  const PRIZES = ['1K','2K','3K','5K','10K','20K','40K','80K','1.6L','3.2L','6.4L','12.5L','25L','50L','1Cr','1Cr'];
  const getCurrentPrize = i => PRIZES[i] || '0';

  const getSafeAmount = i => {
    if (i <= 4) return '0';
    if (i <= 9) return '10K';
    if (i <= 14) return '3.2L';
    return '1Cr';
  };

  const onTimeout = () => {
    soundWrong?.replayAsync();
    const safe = getSafeAmount(idx - 1);
    Alert.alert("Time's up!", `You win ₹${safe}`, [
      { text: 'OK', onPress: () => navigation.replace('Result', { won: false, amount: safe }) }
    ]);
  };

  const handleSelect = key => {
    clearInterval(intervalRef.current);
    const correct = questions[idx].answer;
    if (key === correct) {
      soundCorrect?.replayAsync();
      if (LEVEL_ENDS.includes(idx)) {
        setBreakLevel(LEVEL_ENDS.indexOf(idx) + 1);
        setBreakModal(true);
      } else {
        advance(idx + 1);
      }
    } else {
      soundWrong?.replayAsync();
      const safe = getSafeAmount(idx - 1);
      navigation.replace('Result', { won: false, amount: safe });
    }
  };

  const advance = next => {
    setUsedIds(u => [...u, questions[next].id]);
    setIdx(next);
  };

  const onContinue = () => {
    setBreakModal(false);
    advance(idx + 1);
  };

  const onLeave = () => {
    clearInterval(intervalRef.current);
    const safe = getSafeAmount(idx - 1);
    navigation.replace('Result', { won: true, amount: safe });
  };

  const use5050 = () => {
    if (used5050) return;
    const { options, answer } = questions[idx];
    const wrongs = Object.keys(options).filter(k => k !== answer);
    const two = wrongs.sort(() => Math.random() - 0.5).slice(0, 2);
    setVisibleOptions([answer, ...two]);
    setUsed5050(true);
  };

  const useFlip = () => {
    if (usedFlip) return;
    const lvl = questions[idx].level;
    const pool = allQuestions.filter(q => q.level === lvl && !usedIds.includes(q.id));
    if (!pool.length) {
      Alert.alert("No flips left", "All questions of this level used.");
      return;
    }
    const nxt = pool[Math.floor(Math.random() * pool.length)];
    const copy = [...questions]; copy[idx] = nxt;
    setQuestions(copy);
    setUsedIds(u => [...u, nxt.id]);
    setVisibleOptions(['A','B','C','D']);
    setUsedFlip(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7f00ff" />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  const lvl = questions[idx].level;
  const bg = lvl === 'easy' ? '#f5e6ff'
           : lvl === 'medium' ? '#e9d4ff'
           : lvl === 'hard' ? '#dec2ff'
           : '#ecd9ff';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Level Modal */}
      <Modal visible={breakModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.breakBox}>
            <Text style={styles.breakTitle}>
              {LEVEL_LABELS[breakLevel - 1]} level completed!
            </Text>
            <Text style={styles.breakMsg}>
              You secured ₹{SECURED_AMOUNTS[breakLevel]}
            </Text>
            <TouchableOpacity style={styles.contBtn} onPress={onContinue}>
              <Text style={styles.contTxt}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Prize Ladder Modal */}
      <TouchableOpacity style={styles.ladderBtn} onPress={() => setLadderVisible(true)}>
        <Text style={styles.ladderTxt}>🏆 Ladder</Text>
      </TouchableOpacity>
      <Modal visible={ladderVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.ladderModal}>
            <Text style={styles.modalTitle}>Prize Ladder</Text>
            <ScrollView style={{ height: 300 }}>
              <PrizeLadder currentIndex={idx} />
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLadderVisible(false)}>
              <Text style={styles.closeTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.header}>₹{getCurrentPrize(idx)} • Q{idx + 1}</Text>
      <Text style={styles.timer}>{lvl !== 'jackpot' ? `⏱ ${timer}s` : '🎯 Jackpot!'}</Text>

      {/* Animated Time Bar */}
      {lvl !== 'jackpot' && (
        <View style={styles.timerBarContainer}>
          <Animated.View style={[
            styles.timerBarFill,
            {
              width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })
            }
          ]} />
        </View>
      )}

      <QuestionCard
        questionObj={questions[idx]}
        onSelect={handleSelect}
        visibleOptions={visibleOptions}
      />

      <LifelineBar
        onFiftyFifty={use5050}
        onFlipQuestion={useFlip}
        used5050={used5050}
        usedFlip={usedFlip}
      />

      <TouchableOpacity style={styles.leaveBtn} onPress={onLeave}>
        <Text style={styles.leaveTxt}>🚪 Leave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#4b0082' },
  timer: { textAlign: 'center', fontSize: 18, color: '#800080', marginVertical: 10 },

  timerBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0d4ff',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10
  },
  timerBarFill: {
    height: '100%',
    backgroundColor: '#7f00ff'
  },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#7f00ff' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  breakBox: { width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 24, alignItems: 'center' },
  breakTitle: { fontSize: 22, fontWeight: 'bold', color: '#4b0082' },
  breakMsg: { fontSize: 18, color: '#800080', marginVertical: 12 },
  contBtn: { backgroundColor: '#7f00ff', padding: 12, borderRadius: 6 },
  contTxt: { color: '#fff', fontSize: 16 },

  ladderBtn: { position: 'absolute', top: 50, right: 20, backgroundColor: '#daf0ff', padding: 10, borderRadius: 6 },
  ladderTxt: { color: '#4b0082', fontWeight: '600' },

  ladderModal: { width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#4b0082', marginBottom: 10 },
  closeBtn: { marginTop: 12, backgroundColor: '#7f00ff', padding: 10, borderRadius: 6 },
  closeTxt: { color: '#fff', fontSize: 16 },

  leaveBtn: { backgroundColor: '#ff6699', padding: 12, borderRadius: 6, alignSelf: 'center', marginTop: 10 },
  leaveTxt: { color: '#fff', fontSize: 16 }
});
