import React from 'react';
import {View, StyleSheet} from 'react-native';
import Square from './Square';

interface RowProps {
  row: number;
}

const Row = ({row}: RowProps) => {
  return (
    <View style={styles.container}>
      {new Array(8).fill(0).map((_, index) => (
        <Square key={index} row={row} col={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default Row;
