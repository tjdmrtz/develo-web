// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Develo engine public exports.
// Bundle: npx esbuild features/llm-visualization/engine-entry.ts --bundle --format=esm --outfile=develo/js/llm-visualization/engine.js --sourcemap --alias:@=./features/llm-visualization/upstream --target=es2020

export { LLM_VIZ_ASSET_BASE, fetchRequiredAsset, fetchJsonAsset, instantiateLlmWasm } from "./upstream/src/utils/assetBase";
export { initProgramState, runProgram, applyDeveloStage, NANO_SHAPE } from "./upstream/src/llm/Program";
export type { IProgramState, DeveloVizStage } from "./upstream/src/llm/Program";
export { initRender } from "./upstream/src/llm/render/modelRender";
export { fetchFontAtlasData } from "./upstream/src/llm/render/fontRender";
export { loadNativeBindings } from "./upstream/src/llm/NativeBindings";
export { constructModel, createGpuModelForWasm, stepWasmModel, syncWasmDataWithJsAndGpu } from "./upstream/src/llm/GptModelWasm";
export { initModel, setModelInputData } from "./upstream/src/llm/GptModel";
export { TensorF32 } from "./upstream/src/utils/tensor";
export { Vec3, Vec4 } from "./upstream/src/utils/vector";
export { cameraToMatrixView, updateCamera } from "./upstream/src/llm/Camera";
