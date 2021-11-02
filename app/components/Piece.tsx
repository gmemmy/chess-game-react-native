import React, { useCallback } from 'react';
import {Image, StyleSheet} from 'react-native';
import {ChessInstance, Square} from 'chess.js'
import { Vector } from 'react-native-redash'
import { SIZE, toPosition, toTranslation } from './Notation'
import { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

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
  chess: ChessInstance;
  onTurn: () => void;
  enabled: boolean;
}

const Piece = ({ id, position, chess, onTurn, enabled }: PieceProps) => {
  const isGestureActive = useSharedValue(false)
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y)
  const piece = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: isGestureActive.value ? 100 : 10,
    width: SIZE,
    height: SIZE,
    transform: [{translateX: translateX.value}, {translateY: translateY.value}]
  }))

  const movePiece = useCallback((from: Square, to: Square) => {
    const move = chess.moves({verbose: true}).find((m) => m.from === from && m.to === to)
    const {x, y} = toTranslation(move ? to : from)
    translateX.value = withTiming(x)
    translateY.value = withTiming(y, {}, () => {
      isGestureActive.value = false
    })
    if (move) {
      chess.move(move)
      onTurn()
    }
  }, [chess, translateX, translateY, onTurn, isGestureActive])

  const onGestureEvent = useAnimatedGestureHandler({ 
    onStart: () => {
      isGestureActive.value = true
      offsetX.value = translateX.value
      offsetY.value = translateY.value
    },
    onActive: ({translationX, translationY}) => {
      translateX.value = translationX + offsetX.value
      translateY.value = translationY + offsetY.value
    },
    onEnd: () => {
      const from = toPosition({x: offsetX.value, y: offsetY.value})
      const to = toPosition({x: translateX.value, y: translateY.value})
      runOnJS(movePiece)(from, to)
    }
  })

  const from = useAnimatedStyle(() => {
    const position = toTranslation(
      toPosition({x: translateX.value, y: translateY.value})
    )
    return {
      backgroundColor: 'rgba(255, 255, 0, 0.5)',
      position: 'absolute',
      zIndex: isGestureActive.value ? 100 : 10,
      opacity: isGestureActive.value ? 1 : 0,
      width: SIZE,
      height: SIZE,
      transform: [{translateX: position.x}, {translateY: position.y}]
    }
  })

  const to = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
    position: 'absolute',
    zIndex: isGestureActive.value ? 100 : 10,
    opacity: isGestureActive.value ? 1 : 0,
    width: SIZE,
    height: SIZE,
    transform: [{translateX: offsetX.value}, {translateY: offsetY.value}]
  }))

  return (
    <>
      <Animated.View style={from} />
      <Animated.View style={to} />
      <PanGestureHandler onGestureEvent={onGestureEvent} enabled={enabled}>
        <Animated.View style={piece}>
          <Image source={PIECES[id]} style={styles.piece} />
        </Animated.View>
      </PanGestureHandler>
    </>
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
