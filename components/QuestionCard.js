import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function QuestionCard({
  questionObj,
  onSelect,
  visibleOptions = ['A','B','C','D']
}) {
  const { question, options } = questionObj;

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>
      {Object.entries(options).map(([key, text]) =>
        visibleOptions.includes(key) ? (
          <TouchableOpacity
            key={key}
            style={styles.optionButton}
            onPress={() => onSelect(key)}
          >
            <Text style={styles.optionText}>{key}. {text}</Text>
          </TouchableOpacity>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:'#fff',
    borderRadius:8,
    padding:16,
    marginVertical:16,
    elevation:2
  },
  question: {
    fontSize:18,
    marginBottom:12
  },
  optionButton: {
    backgroundColor:'#eee',
    padding:12,
    borderRadius:6,
    marginVertical:6
  },
  optionText: {
    fontSize:16
  }
});
