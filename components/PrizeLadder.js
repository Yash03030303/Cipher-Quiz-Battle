import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';

const ladder = [
  '1 Cr','50 L','25 L','12.5 L','6.4 L',
  '3.2 L','1.6 L','80 K','40 K','20 K',
  '10 K','5 K','3 K','2 K','1 K'
];

export default function PrizeLadder({ currentIndex }) {
  const slideAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [currentIndex]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <ScrollView>
        {ladder.map((amt, idx) => {
          const qNum = ladder.length - idx;
          const active = currentIndex + 1 === qNum;
          return (
            <View key={qNum} style={[styles.item, active && styles.activeItem]}>
              <Text style={[styles.text, active && styles.activeText]}>
                Q{qNum}: ₹{amt}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#f7f0ff',
    borderRadius:8,
    padding:8,
    elevation:4,
    maxHeight: 300
  },
  item: {
    paddingVertical:8,
    paddingHorizontal:12,
    borderBottomWidth:1,
    borderBottomColor:'#ddd'
  },
  text: {
    fontSize:14,
    color:'#4b0082'
  },
  activeItem: {
    backgroundColor:'#7f00ff'
  },
  activeText: {
    color:'#fff',
    fontWeight:'bold'
  }
});
