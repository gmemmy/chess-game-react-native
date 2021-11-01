import React from 'react';
import {View, StyleSheet} from 'react-native';
import Row from './Row';

const Background = () => {
  return (
    <View style={styles.container}>
      {new Array(8).fill(0).map((_, index) => (
        <Row key={index} row={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Background;
