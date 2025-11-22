import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AcMode } from '../types';

interface WindEffectProps {
  isOn: boolean;
  mode: AcMode;
}

export const WindEffect: React.FC<WindEffectProps> = ({ isOn, mode }) => {
  const count = 100;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Precompute random starting positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 3; // Width of vent
      const y = (Math.random() - 0.5) * 0.5 - 0.5; // Height of vent
      const z = Math.random() * 2; // Initial forward spread
      const speed = Math.random() * 0.1 + 0.1;
      temp.push({ x, y, z, speed, initialX: x, initialY: y });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;

    if (!isOn) {
      mesh.current.visible = false;
      return;
    }
    
    mesh.current.visible = true;

    particles.forEach((particle, i) => {
      // Move forward (Negative Z is usually 'out' towards camera depending on rotation, 
      // but here we want it to blow OUT from the front of the AC.
      // Assuming AC faces +Z, we blow +Z. 
      particle.z += particle.speed;

      // Reset if too far
      if (particle.z > 5) {
        particle.z = 0;
        particle.x = particle.initialX;
        particle.y = particle.initialY;
      }

      // Add some "turbulence"
      particle.x += Math.sin(state.clock.elapsedTime * 10 + i) * 0.002;

      dummy.position.set(particle.x, particle.y, particle.z + 0.6); // +0.6 to start slightly in front
      
      // Scale down as they get further to fade out effectively
      const scale = Math.max(0, 1 - (particle.z / 5));
      dummy.scale.set(scale, scale, scale * 3); // Stretch along movement
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  const color = mode === AcMode.COOL ? '#60a5fa' : '#fb923c'; // blue-400 vs orange-400

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {/* Thin strips of "wind" */}
      <boxGeometry args={[0.05, 0.05, 0.5]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </instancedMesh>
  );
};