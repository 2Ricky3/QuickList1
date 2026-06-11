import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { motion } from "../GlobalStyleSheet";

interface EntranceAnimationOptions {
  /** Number of staggered elements to animate in. */
  count?: number;
  /** Delay the animation until this becomes true (e.g. after loading). */
  enabled?: boolean;
  /** How far elements slide up from, in pixels. */
  slideDistance?: number;
}

/**
 * Shared fade + slide-up entrance animation. Returns one animated style
 * per element; spread them onto Animated.Views in visual order to get a
 * consistent staggered entrance on every screen.
 *
 * const [headerStyle, listStyle] = useEntranceAnimation({ count: 2 });
 * <Animated.View style={[styles.header, headerStyle]}>...
 */
export const useEntranceAnimation = ({
  count = 1,
  enabled = true,
  slideDistance = motion.slideDistance,
}: EntranceAnimationOptions = {}) => {
  const anims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!enabled || hasStarted.current) return;
    hasStarted.current = true;
    Animated.stagger(
      motion.stagger,
      anims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: motion.entranceSpring.tension,
          friction: motion.entranceSpring.friction,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [enabled]);

  return anims.map((anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [slideDistance, 0],
        }),
      },
    ],
  }));
};
