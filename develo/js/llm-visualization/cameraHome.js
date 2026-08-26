export const HOME_CAMERA = {
  center: [42.771, 0.0, -569.287],
  angle: [284.959, 26.501, 12.867],
};

export function homeCamera(Vec3) {
  return {
    center: new Vec3(HOME_CAMERA.center[0], HOME_CAMERA.center[1], HOME_CAMERA.center[2]),
    angle: new Vec3(HOME_CAMERA.angle[0], HOME_CAMERA.angle[1], HOME_CAMERA.angle[2]),
  };
}
