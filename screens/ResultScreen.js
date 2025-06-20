import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { won, amount } = route.params;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={[styles.message, won ? styles.win : styles.lose]}>
          {won ? '🎉 Congratulations!' : '😞 Game Over'}
        </Text>
        <Text style={styles.amount}>
          {won
            ? `You won ₹${amount}`
            : `You secured ₹${amount}`}
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#f7f0ff',
    justifyContent:'center',
    alignItems:'center'
  },
  card: {
    backgroundColor:'#fff',
    padding:30,
    borderRadius:12,
    alignItems:'center',
    elevation:6
  },
  message: {
    fontSize:28,
    fontWeight:'bold',
    marginBottom:12
  },
  win: {
    color:'#4b0082'
  },
  lose: {
    color:'#ff4d4d'
  },
  amount: {
    fontSize:22,
    color:'#800080',
    marginBottom:24
  },
  button: {
    backgroundColor:'#7f00ff',
    paddingVertical:12,
    paddingHorizontal:36,
    borderRadius:24
  },
  buttonText: {
    color:'#fff',
    fontSize:16,
    fontWeight:'600'
  }
});
