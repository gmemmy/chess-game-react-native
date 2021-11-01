import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface SquareProps {
  col: number;
  row: number;
}

const WHITE = 'rgb(100, 133, 68)';
const BLACK = 'rgb(230, 233, 198)';

const Square = ({col, row}: SquareProps) => {
  const offset = row % 2 === 0 ? 1 : 0;
  const backgroundColor = (col + offset) % 2 === 0 ? WHITE : BLACK;
  const textColor = (col + offset) % 2 === 0 ? BLACK : WHITE;
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Text
        style={[
          styles.textStyle,
          {color: textColor, opacity: col === 0 ? 1 : 0},
        ]}>
        {8 - row}
      </Text>
      <Text
        style={[
          styles.textStyle,
          {color: textColor, opacity: row === 7 ? 1 : 0, alignSelf: 'flex-end'},
        ]}>
        {String.fromCharCode('a'.charCodeAt(0) + col)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    justifyContent: 'space-between',
  },
  textStyle: {
    fontWeight: '500',
  },
});

export default Square;
