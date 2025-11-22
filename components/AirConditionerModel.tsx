import React, { useRef } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AcMode } from '../types';

interface ACProps {
  isOn: boolean;
  temp: number;
  mode: AcMode;
}

export const AirConditionerModel: React.FC<ACProps> = ({ isOn, temp, mode }) => {
  const flapRef = useRef<THREE.Mesh>(null);

  // Animate flap rotation smoothly
  useFrame((state, delta) => {
    if (flapRef.current) {
      // Target rotation: Open (approx 45 degrees) if ON, Closed (0) if OFF
      const targetRotation = isOn ? Math.PI / 4 : 0;
      flapRef.current.rotation.x = THREE.MathUtils.lerp(
        flapRef.current.rotation.x,
        targetRotation,
        delta * 5
      );
    }
  });

  // Text color needs to be darker to be visible on the new pale blue background
  // Dark Blue for Cool, Dark Orange for Heat
  const textColor = isOn 
    ? (mode === AcMode.COOL ? '#1d4ed8' : '#c2410c') 
    : '#94a3b8'; 

  return (
    <group>
      {/* Main Body */}
      <RoundedBox args={[4.2, 2.5, 1.5]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </RoundedBox>

      {/* Front Panel Indentation (Main Face) */}
      <RoundedBox args={[3.9, 2.2, 0.1]} radius={0.05} position={[0, 0, 0.76]}>
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </RoundedBox>

      {/* LCD Screen Area - Smaller Size & Centered */}
      <group position={[0, 0.3, 0.82]}>
        {/* Pale Blue Screen Background */}
        <RoundedBox args={[0.8, 0.35, 0.02]} radius={0.02}>
            <meshStandardMaterial color="#dbeafe" roughness={0.3} metalness={0.1} />
        </RoundedBox>
        
        {/* The Digital Display Text */}
        <Text
            position={[0, 0, 0.03]}
            fontSize={0.18}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            characters="0123456789°C"
            fontWeight={700}
        >
            {isOn ? `${temp}°C` : ''}
        </Text>
      </group>
      
      {/* Status Light - Small dot */}
      <mesh position={[1.6, -0.8, 0.82]}>
           <circleGeometry args={[0.04, 32]} />
           <meshBasicMaterial color={isOn ? "#22c55e" : "#ef4444"} toneMapped={false} />
      </mesh>
      {isOn && (
        <pointLight position={[1.6, -0.8, 0.9]} color="#22c55e" intensity={0.5} distance={0.5} />
      )}


      {/* Vent / Grill at the bottom */}
      <group position={[0, -0.6, 0.78]}>
        {/* Vent opening background */}
        <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.4, 0.5]} />
            <meshStandardMaterial color="#334155" />
        </mesh>
        
        {/* Moving Flap with Ref for Animation */}
        <mesh 
            ref={flapRef}
            position={[0, 0.1, 0.1]} 
        >
             <boxGeometry args={[3.4, 0.1, 0.05]} />
             <meshStandardMaterial color="#e2e8f0" />
        </mesh>

        {/* Horizontal slats behind flap */}
        {[0, -0.1].map((y, i) => (
            <mesh key={i} position={[0, y, 0.02]}>
                <boxGeometry args={[3.2, 0.02, 0.05]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
        ))}
      </group>

      {/* Brand / Decorative Line */}
      <mesh position={[0, -0.1, 0.81]}>
         <planeGeometry args={[3.9, 0.02]} />
         <meshBasicMaterial color="#e2e8f0" />
      </mesh>

      {/* Energy Label - Stylized (Top Left) */}
      <group position={[-1.4, 0.6, 0.81]} scale={0.8}>
        <mesh>
            <planeGeometry args={[0.5, 0.7]} />
            <meshBasicMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0, 0.2, 0.01]}>
            <planeGeometry args={[0.4, 0.2]} />
            <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Colored bars */}
        {[-0.1, -0.05, 0, 0.05].map((y, i) => (
             <mesh key={i} position={[0, y - 0.15, 0.01]}>
                <planeGeometry args={[0.3 - (i * 0.05), 0.03]} />
                <meshBasicMaterial color={`hsl(${120 - i * 30}, 100%, 50%)`} />
            </mesh>
        ))}
      </group>

      {/* Feet */}
      <mesh position={[-1.5, -1.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[1.5, -1.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

    </group>
  );
};