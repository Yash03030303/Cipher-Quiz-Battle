import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function LifelineBar({
  onFiftyFifty,
  onFlipQuestion,
  used5050,
  usedFlip
}) {
  return (
    <View style={styles.container}>
      <Button
        title="50:50"
        onPress={onFiftyFifty}
        disabled={used5050}
      />
      <Button
        title="Flip"
        onPress={onFlipQuestion}
        disabled={usedFlip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent:'space-around',
    marginVertical:12
  }
});
