const BASE_CONFIG = {
  antialias: true,
  backgroundColor: 0x000000,
  camera: {
    fov: 60,
    near: 0.01,
    far: 500,
    startPosition: { x: 0, y: 50, z: -30 },
    lookAt: { x: 0, y: 0, z: 8 },
    enableOrbitControls: true,
  },
  lights: {
    ambient: {
      color: 0xFFEFE4,
      intensity: 0.8,
    },
    directional: {
      color: 0xFFEFE4,
      intensity: 0.8,
      position: { x: 20, y: 12, z: -3 },
    },
  },
  physics: {
    enableCannonDebugger: true,
    gravity: { x: 0, y: -9.82, z: 0 },
    sleepSpeedLimit: 0.2,
    sleepTimeLimit: 0.5,
  }
};

export default BASE_CONFIG;
