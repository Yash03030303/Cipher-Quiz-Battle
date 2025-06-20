// screens/HomeScreen.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Modal, ScrollView
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(-300)).current;
  const [rulesVisible, setRulesVisible] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, []);

  const openRules = () => {
    setRulesVisible(true);
    slide.setValue(-300);
    Animated.spring(slide, {
      toValue: 0,
      useNativeDriver: true
    }).start();
  };

  const closeRules = () => {
    Animated.timing(slide, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true
    }).start(() => setRulesVisible(false));
  };

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <Text style={styles.title}>🎓 KBC Quiz</Text>

      <TouchableOpacity
        style={styles.mainBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.btnText}>Start Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mainBtn}
        activeOpacity={0.85}
        onPress={openRules}
      >
        <Text style={styles.btnText}>📖 Rules</Text>
      </TouchableOpacity>

      {/* Rules Modal */}
      <Modal visible={rulesVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalBox, { transform: [{ translateY: slide }] }]}>
            <Text style={styles.modalTitle}>Game Rules</Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.ruleItem}>• Total 16 Questions to win ₹1 Crore.</Text>
              <Text style={styles.ruleItem}>• Levels:</Text>
              <Text style={styles.subItem}>– Easy: Q1–5 (25 seconds each)</Text>
              <Text style={styles.subItem}>– Medium: Q6–10 (35 seconds each)</Text>
              <Text style={styles.subItem}>– Hard: Q11–15 (45 seconds each)</Text>
              <Text style={styles.subItem}>– Jackpot: Q16 (Unlimited time)</Text>
              <Text style={styles.ruleItem}>• Lifelines (once per game):</Text>
              <Text style={styles.subItem}>– 50:50: Remove two wrong options</Text>
              <Text style={styles.subItem}>– Flip: Swap question for same level</Text>
              <Text style={styles.ruleItem}>• Safe Amount:</Text>
              <Text style={styles.subItem}>– Wrong in Easy → ₹0</Text>
              <Text style={styles.subItem}>– Wrong in Medium → ₹10K</Text>
              <Text style={styles.subItem}>– Wrong in Hard → ₹3.2L</Text>
              <Text style={styles.ruleItem}>• Leave Game at any time to secure your current safe amount.</Text>
              <Text style={styles.ruleItem}>• Use the Prize Ladder during the game to track your progress.</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={closeRules}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 36,
    color: '#4b0082',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center'
  },
  mainBtn: {
    backgroundColor: '#7f00ff',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 4,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4b0082',
    marginBottom: 12,
    textAlign: 'center'
  },
  modalContent: {
    marginBottom: 20
  },
  ruleItem: {
    fontSize: 16,
    color: '#4b0082',
    marginVertical: 4
  },
  subItem: {
    fontSize: 14,
    color: '#800080',
    marginLeft: 12,
    marginVertical: 2
  },
  modalCloseBtn: {
    backgroundColor: '#7f00ff',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center'
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
