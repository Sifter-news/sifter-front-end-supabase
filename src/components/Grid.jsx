import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

const Grid = ({ size = 100, divisions = 24 }) => {
  const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x333333);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;

  const dotGeometry = new THREE.BufferGeometry();
  const positions = [];
  const halfSize = size / 2;
  const spacing = size / divisions;

  for (let i = -halfSize; i <= halfSize; i += spacing) {
    for (let j = -halfSize; j <= halfSize; j += spacing) {
      positions.push(i, 0, j);
    }
  }

  dotGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  // Create coordinate labels
  const labels = [];
  const step = size / 4; // Show fewer labels for clarity
  
  // X axis labels (red)
  for (let x = -halfSize; x <= halfSize; x += step) {
    labels.push(
      <Text
        key={`x${x}`}
        position={[x, 0.5, -halfSize - 5]}
        color="red"
        fontSize={4}
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(x)}
      </Text>
    );
  }
  
  // Z axis labels (blue)
  for (let z = -halfSize; z <= halfSize; z += step) {
    labels.push(
      <Text
        key={`z${z}`}
        position={[-halfSize - 5, 0.5, z]}
        color="blue"
        fontSize={4}
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(z)}
      </Text>
    );
  }
  
  // Y axis label (green)
  labels.push(
    <Text
      key="y0"
      position={[-halfSize - 10, 0, -halfSize - 10]}
      color="green"
      fontSize={4}
      anchorX="center"
      anchorY="middle"
    >
      Y: 0
    </Text>
  );

  return (
    <group>
      <primitive object={gridHelper} />
      <points>
        <bufferGeometry attach="geometry" {...dotGeometry} />
        <pointsMaterial
          attach="material"
          size={2}
          sizeAttenuation={false}
          color={0xffffff}
          transparent
          opacity={0.5}
        />
      </points>
      {labels}
    </group>
  );
};

export default Grid;