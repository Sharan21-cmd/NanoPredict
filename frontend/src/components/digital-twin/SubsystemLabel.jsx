import React from "react";
import { Text } from "@react-three/drei";

export default function SubsystemLabel({
  children,
  position = [0, 0, 0],
  color = "#9bdcff",
  size = 0.16,
}) {
  return (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.015}
      outlineColor="#061018"
      renderOrder={10}
    >
      {String(children).toUpperCase()}
    </Text>
  );
}
