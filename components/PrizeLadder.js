import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ladder = [
  '1 Cr','50 L','25 L','12.5 L','6.4 L',
  '3.2 L','1.6 L','80 K','40 K','20 K',
  '10 K','5 K','3 K','2 K','1 K'
];

export default function PrizeLadder({ currentIndex }) {
  return (
    <ScrollView style={styles.container}>
      {ladder.map((amt, idx) => {
        const qNum = ladder.length - idx; // Q16 at top
        const isActive = currentIndex + 1 === qNum;
        return (
          <Text
            key={qNum}
            style={[styles.item, isActive && styles.active]}
          >
            Q{qNum}: ₹{amt}
          </Text>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#f7f7f7',
    borderRadius:6
  },
  item: {
    padding:8,
    fontSize:12,
    color:'#333'
  },
  active: {
    backgroundColor:'#4caf50',
    color:'#fff',
    fontWeight:'bold'
  }
});
