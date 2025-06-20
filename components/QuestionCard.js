import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated
} from 'react-native';

export default function QuestionCard({
  questionObj, onSelect, visibleOptions=['A','B','C','D']
}) {
  const fade = useRef(new Animated.Value(0)).current;

  // Fade-in animation on each question change
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start();
  }, [questionObj]);

  return (
    <Animated.View style={[styles.card,{opacity:fade}]}>
      <Text style={styles.qText}>{questionObj.question}</Text>
      {Object.entries(questionObj.options).map(([k,v]) =>
        visibleOptions.includes(k) && (
          <TouchableOpacity
            key={k}
            style={styles.optionBtn}
            onPress={()=>onSelect(k)}
          >
            <Text style={styles.optionText}>{k}. {v}</Text>
          </TouchableOpacity>
        )
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:'#f7f0ff',
    borderRadius:10,
    padding:20,
    marginVertical:20,
    elevation:4
  },
  qText: {
    fontSize:18,
    color:'#4b0082',
    marginBottom:12
  },
  optionBtn: {
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderColor:'#7f00ff',
    borderRadius:6,
    padding:12,
    marginVertical:6
  },
  optionText: {
    fontSize:16,
    color:'#4b0082'
  }
});
