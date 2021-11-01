import React from 'react';
import {Image, StyleSheet, Animated} from 'react-native';
import { Chess } from 'chess.js'
import { Vector } from 'react-native-redash'
import { SIZE } from './Notation'
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'

type Player = "b" | "w";
type Type = "q" | "r" | "n" | "b" | "k" | "p";
type Piece =`${Player}${Type}`;
type Pieces = Record<Piece, ReturnType<typeof require>>;
export const PIECES: Pieces = {
  br: require("../assets/black-rook.png"),
  bp: require("../assets/black-pawn.png"),
  bn: require("../assets/black-knight.png"),
  bb: require("../assets/black-bishop.png"),
  bq: require("../assets/black-queen.png"),
  bk: require("../assets/black-king.png"),
  wr: require("../assets/white-rook.png"),
  wn: require("../assets/white-knight.png"),
  wb: require("../assets/white-bishop.png"),
  wq: require("../assets/white-queen.png"),
  wk: require("../assets/white-queen.png"),
  wp: require("../assets/white-pawn.png"),
};

interface PieceProps {
  id: Piece;
  position: Vector;
  chess: Chess;
  onTurn: () => void;
  enabled: boolean;
}

const Piece = ({ id, position }: PieceProps) => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y)
  const piece = useAnimatedStyle(() => ({
    position: 'absolute',
    width: SIZE,
    height: SIZE,
   transform: [{translateX: translateX.value}, {translateY: translateY.value}]
  }))
  return (
    <PanGestureHandler>
      <Animated.View style={piece}>
        <Image source={PIECES[id]} style={styles.piece} />
      </Animated.View>
    </PanGestureHandler>
  )
};

const styles = StyleSheet.create({
  piece: {
    width: SIZE,
    height: SIZE,
  },
  pieceWrapper: {
    position: 'absolute',
    width: 50,
    height: 50,
  }
});

export default Piece;
