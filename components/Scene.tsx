import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { AirConditionerModel } from './AirConditionerModel';
import { WindEffect } from './WindEffect';
import { AcState } from '../types';

interface SceneProps {
  acState: AcState;
}

export const Scene: React.FC<SceneProps> = ({ acState }) => {
  return (
    // Use w-full and h-full to fill the parent flex container
    <div className="w-full h-full cursor-move">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Environment preset="warehouse" />

          <group position={[0, 0.5, 0]}> {/* Shift model up slightly to be centered visually in canvas */}
            <AirConditionerModel 
              isOn={acState.isOn} 
              temp={acState.temp} 
              mode={acState.mode} 
            />
            
            {/* Wind originates from the vent area */}
            <group position={[0, -0.6, 0.8]}>
               <WindEffect isOn={acState.isOn} mode={acState.mode} />
            </group>
          </group>

          <ContactShadows 
            position={[0, -0.9, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />

          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.8}
            minDistance={4}
            maxDistance={12}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};