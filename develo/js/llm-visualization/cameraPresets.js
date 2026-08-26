export const CAMERA_PRESETS = {
  overview: {
    center: [42.771, 0.0, -569.287],
    angle: [284.959, 26.501, 12.867],
  },
  tokens: {
    center: [0.0, 8.0, -36.0],
    angle: [284.959, 18.0, 4.2],
  },
  embedding: {
    center: [18.0, 24.0, -70.0],
    angle: [292.0, 22.0, 5.4],
  },
  qkv: {
    center: [48.0, 70.0, -110.0],
    angle: [268.0, 20.0, 4.8],
  },
  attention: {
    center: [36.0, 86.0, -96.0],
    angle: [302.0, 24.0, 5.2],
  },
  transformer: {
    center: [42.771, 40.0, -280.0],
    angle: [284.959, 22.0, 8.6],
  },
  output: {
    center: [8.0, 220.0, -420.0],
    angle: [284.959, 18.0, 7.2],
  },
};

export function presetToCamera(name, Vec3) {
  const p = CAMERA_PRESETS[name] || CAMERA_PRESETS.overview;
  return {
    center: new Vec3(p.center[0], p.center[1], p.center[2]),
    angle: new Vec3(p.angle[0], p.angle[1], p.angle[2]),
  };
}
