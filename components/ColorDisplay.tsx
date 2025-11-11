import React from "react";
import { View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ColorDisplayProps {
  colorData: string | { type: 'solid' | 'gradient'; color?: string; colors?: string[] };
  style?: ViewStyle;
  fallbackColor?: string;
}


export const ColorDisplay: React.FC<ColorDisplayProps> = ({ 
  colorData, 
  style, 
  fallbackColor = "#C20200" 
}) => {
  
  if (typeof colorData === 'string') {
    try {
      const parsed = JSON.parse(colorData);
      if (parsed.type === 'gradient' && parsed.colors) {
        return (
          <LinearGradient
            colors={parsed.colors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={style}
          />
        );
      } else if (parsed.type === 'solid' && parsed.color) {
        return <View style={[style, { backgroundColor: parsed.color }]} />;
      }
    } catch {
   
      return <View style={[style, { backgroundColor: colorData }]} />;
    }
  }


  if (typeof colorData === 'object' && colorData !== null) {
    if (colorData.type === 'gradient' && colorData.colors) {
      return (
        <LinearGradient
          colors={colorData.colors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={style}
        />
      );
    } else if (colorData.type === 'solid' && colorData.color) {
      return <View style={[style, { backgroundColor: colorData.color }]} />;
    }
  }

 
  return <View style={[style, { backgroundColor: fallbackColor }]} />;
};


export const getColorValue = (
  colorData: string | { type: 'solid' | 'gradient'; color?: string; colors?: string[] },
  fallbackColor: string = "#C20200"
): string => {
  
  if (typeof colorData === 'string') {
    try {
      const parsed = JSON.parse(colorData);
      if (parsed.type === 'gradient' && parsed.colors) {
        return parsed.colors[0];
      } else if (parsed.type === 'solid' && parsed.color) {
        return parsed.color;
      }
    } catch {
      
      return colorData;
    }
  }

  
  if (typeof colorData === 'object' && colorData !== null) {
    if (colorData.type === 'gradient' && colorData.colors) {
      return colorData.colors[0];
    } else if (colorData.type === 'solid' && colorData.color) {
      return colorData.color;
    }
  }

  return fallbackColor;
};
