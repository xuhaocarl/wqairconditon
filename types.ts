import 'react';

export enum AcMode {
  COOL = 'cool',
  HEAT = 'heat'
}

export interface AcState {
  isOn: boolean;
  temp: number;
  mode: AcMode;
}

// Augment global JSX namespace to support React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      instancedMesh: any;
      boxGeometry: any;
      planeGeometry: any;
      circleGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      primitive: any;
      [elemName: string]: any;
    }
  }
}

// Also augment module JSX for older consumers
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      instancedMesh: any;
      boxGeometry: any;
      planeGeometry: any;
      circleGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      primitive: any;
      [elemName: string]: any;
    }
  }
}
