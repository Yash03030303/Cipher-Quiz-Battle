import React from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LifelineBar({
  onFiftyFifty,
  onFlipQuestion,
  used5050,
  usedFlip
}) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onFiftyFifty} disabled={used5050}>
        <View style={[styles.lifeline, used5050 && styles.disabled]}>
          <MaterialIcons name="filter-2" size={28} color={used5050 ? '#ccc' : '#7f00ff'} />
          <Animated.Text style={[styles.label, used5050 && styles.disabledLabel]}>50:50</Animated.Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onFlipQuestion} disabled={usedFlip}>
        <View style={[styles.lifeline, usedFlip && styles.disabled]}>
          <MaterialIcons name="flip-camera-ios" size={28} color={usedFlip ? '#ccc' : '#7f00ff'} />
          <Animated.Text style={[styles.label, usedFlip && styles.disabledLabel]}>Flip</Animated.Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent:'space-around',
    marginVertical:16
  },
  lifeline: {
    alignItems:'center',
    padding:10,
    backgroundColor:'#ffffff',
    borderRadius:8,
    elevation:3
  },
  label: {
    marginTop:4,
    color:'#4b0082',
    fontWeight:'600'
  },
  disabled: {
    backgroundColor:'#f0f0f0'
  },
  disabledLabel: {
    color:'#aaa'
  }
});
