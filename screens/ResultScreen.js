import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { won, amount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {won ? `🎉 You Won ₹${amount}!` : `😞 You Lost at ₹${amount}`}
      </Text>
      <Button title="Play Again" onPress={() => navigation.replace('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
});
