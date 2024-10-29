import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const ThreeDNode = ({ node, activeTool, onUpdate, onStartConnection, onEndConnection }) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const { camera, gl } = useThree();

  const handlePointerDown = (e) => {
    if (activeTool !== 'select') return;

    if (e.button === 2) { // Right click
      e.stopPropagation();
      setIsConnecting(true);
      onStartConnection(node.id, node.position);
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      position: [...node.position]
    });
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e) => {
    if (activeTool !== 'select') return;

    if (isConnecting) {
      setIsConnecting(false);
      onEndConnection(node.id);
      return;
    }
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStart || activeTool !== 'select') return;

    const deltaX = (e.clientX - dragStart.x) * 0.1;
    const deltaZ = (e.clientY - dragStart.y) * 0.1;

    const cameraRotation = camera.rotation.y;
    const newX = dragStart.position[0] + (deltaX * Math.cos(cameraRotation) - deltaZ * Math.sin(cameraRotation));
    const newZ = dragStart.position[2] + (deltaX * Math.sin(cameraRotation) + deltaZ * Math.cos(cameraRotation));

    const newPosition = [newX, dragStart.position[1], newZ];
    onUpdate(newPosition);
  };

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <boxGeometry args={[5, 5, 0.2]} />
      <meshStandardMaterial color="#4A90E2" />
      <Html
        position={[0, 0, 0.1]}
        center
        style={{
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {node.title}
      </Html>
    </mesh>
  );
};

export default ThreeDNode;