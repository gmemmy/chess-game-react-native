import React, {useCallback, useRef, useState} from 'react';
import {View} from 'react-native';
import {Chess} from 'chess.js';
import Background from '../components/Background';
import Piece from '../components/Piece';
import {SIZE} from '../components/Notation';

function useConst<T>(initialValue: T | (() => T)): T {
  const ref = useRef<{value: T}>();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value:
        typeof initialValue === 'function'
          ? (initialValue as Function)()
          : initialValue,
    };
  }
  return ref.current.value;
}

const Game = () => {
  const chess = useConst(() => new Chess());
  const [state, setState] = useState({
    player: 'w',
    board: chess.board(),
  });

  const onTurn = useCallback(
    () =>
      setState({
        player: state.player === 'w' ? 'b' : 'w',
        board: chess.board(),
      }),
    [chess, state.player],
  );

  return (
    <View style={{flex: 1, marginVertical: 250}}>
      <Background />
      {state.board.map((row, y) =>
        row.map((square, x) => {
          if (square === null) {
            return null;
          }
          return (
            <Piece
              key={`${x}-${y}`}
              enabled={state.player === square.color}
              onTurn={onTurn}
              chess={chess}
              position={{x: x * SIZE, y: y * SIZE}}
              id={`${square.color}${square.type}` as const}
            />
          );
        }),
      )}
    </View>
  );
};

export default Game;
