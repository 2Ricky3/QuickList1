import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
}

interface ConfettiCelebrationProps {
  show: boolean;
  onComplete?: () => void;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ show, onComplete }) => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];

  useEffect(() => {
    if (show) {
  
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        const startX = Math.random() * width;
        pieces.push({
          id: i,
          x: new Animated.Value(startX),
          y: new Animated.Value(-20),
          rotation: new Animated.Value(0),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      confettiPieces.current = pieces;

   
      const animations = pieces.map((piece, index) => {
        const startX = (index * width) / 50;
        return Animated.parallel([
          Animated.timing(piece.y, {
            toValue: height + 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: 360 * (3 + Math.random() * 2),
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(piece.x, {
            toValue: startX + (Math.random() - 0.5) * 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(20, animations).start(() => {
        if (onComplete) onComplete();
      });
    }
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
