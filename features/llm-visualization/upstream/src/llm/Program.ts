// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Develo nano-only program: no walkthrough shell, no GPT-2/GPT-3 cards.

import { genModelViewMatrices, ICamera, updateCamera } from "./Camera";
import { drawAllArrows } from "./components/Arrow";
import { drawBlockLabels } from "./components/SectionLabels";
import { drawModelCard } from "./components/ModelCard";
import { drawTokens } from "./components/Tokens";
import { IGptModelLink, IGpuGptModel, IModelShape } from "./GptModel";
import { genGptModelLayout, IBlkDef, IGptModelLayout } from "./GptModelLayout";
import { IFontAtlasData } from "./render/fontRender";
import { initRender, IRenderState, IRenderView, renderModel, resetRenderBuffers } from "./render/modelRender";
import { beginQueryAndGetPrevMs, endQuery } from "./render/queryManager";
import { isNotNil } from "@/src/utils/data";
import { Vec3, Vec4 } from "@/src/utils/vector";
import { IColorMix } from "./Annotations";
import { Mat4f } from "@/src/utils/matrix";
import { RenderPhase } from "./render/sharedRender";
import { NativeFunctions } from "./NativeBindings";
import { IWasmGptModel, stepWasmModel, syncWasmDataWithJsAndGpu } from "./GptModelWasm";
import { IBlockRender } from "./render/blockRender";
import { ILayout } from "../utils/layout";
import { DimStyle } from "./walkthrough/WalkthroughTools";
import { Subscriptions } from "../utils/hooks";

export type DeveloVizStage =
  | "tokens"
  | "embedding"
  | "qkv"
  | "attention"
  | "transformer"
  | "output"
  | "prediction"
  | "idle"
  | "interactive";

export const NANO_SHAPE: IModelShape = {
  B: 1,
  T: 11,
  C: 48,
  nHeads: 3,
  A: 16,
  nBlocks: 3,
  vocabSize: 3,
};

export interface IProgramState {
    native: NativeFunctions | null;
    wasmGptModel: IWasmGptModel | null;
    stepModel: boolean;
    mouse: IMouseState;
    render: IRenderState;
    inWalkthrough: boolean;
    walkthrough: { markDirty: () => void; running: boolean; time: number; phaseLength: number };
    camera: ICamera;
    htmlSubs: Subscriptions;
    layout: IGptModelLayout;
    mainExample: IModelExample;
    examples: IModelExample[];
    currExampleId: number;
    shape: IModelShape;
    gptGpuModel: IGpuGptModel | null;
    jsGptModel: IGptModelLink | null;
    movement: {
        action: null;
        actionHover: null;
        target: [number, number];
        depth: number;
        cameraLerp: null;
    };
    display: IDisplayState;
    pageLayout: ILayout;
    markDirty(): void;
    stage: DeveloVizStage;
    stageProgress: number;
    visible: boolean;
    interactive: boolean;
    reducedMotion: boolean;
    inputLength: number;
    generatedLength: number;
}

export interface IModelExample {
    name: string;
    shape: IModelShape;
    enabled: boolean;
    layout?: IGptModelLayout;
    blockRender: IBlockRender;
    offset: Vec3;
    modelCardOffset: Vec3;
    camera?: { center: Vec3; angle: Vec3 };
}

export interface IMouseState {
    mousePos: Vec3;
}

export interface IDisplayState {
    tokenColors: IColorMix | null;
    tokenIdxColors: IColorMix | null;
    tokenOutputColors: IColorMix | null;
    tokenIdxModelOpacity?: number[];
    topOutputOpacity?: number;
    lines: string[];
    hoverTarget: IHoverTarget | null;
    blkIdxHover: number[] | null;
    dimHover: DimStyle | null;
}

export interface IHoverTarget {
    subCube: IBlkDef;
    mainCube: IBlkDef;
    mainIdx: Vec3;
}

export function initProgramState(canvasEl: HTMLCanvasElement, fontAtlasData: IFontAtlasData): IProgramState {
    let render = initRender(canvasEl, fontAtlasData);

    let camera: ICamera = {
        angle: new Vec3(284.959, 26.501, 12.867),
        center: new Vec3(42.771, 0.000, -569.287),
        transition: {},
        modelMtx: new Mat4f(),
        viewMtx: new Mat4f(),
        lookAtMtx: new Mat4f(),
        camPos: new Vec3(),
        camPosModel: new Vec3(),
    };

    let shape = { ...NANO_SHAPE };

    return {
        native: null,
        wasmGptModel: null,
        render: render!,
        inWalkthrough: false,
        walkthrough: { markDirty: () => {}, running: false, time: 0, phaseLength: 0 },
        camera,
        shape,
        layout: genGptModelLayout(shape),
        currExampleId: -1,
        mainExample: {
            name: 'nano-gpt',
            enabled: true,
            shape,
            offset: new Vec3(),
            modelCardOffset: new Vec3(),
            blockRender: null!,
            camera: { center: new Vec3(42.771, 0.000, -569.287), angle: new Vec3(284.959, 26.501, 12.867) },
        },
        examples: [],
        gptGpuModel: null,
        jsGptModel: null,
        stepModel: false,
        markDirty: () => { },
        htmlSubs: new Subscriptions(),
        mouse: {
            mousePos: new Vec3(),
        },
        movement: {
            action: null,
            actionHover: null,
            target: [0, 0],
            depth: 1,
            cameraLerp: null,
         },
        display: {
            tokenColors: null,
            tokenIdxColors: null,
            tokenOutputColors: null,
            lines: [],
            hoverTarget: null,
            dimHover: null,
            blkIdxHover: null,
        },
        pageLayout: {
            height: 0,
            width: 0,
            isDesktop: true,
            isPhone: false,
        },
        stage: "idle",
        stageProgress: 0,
        visible: false,
        interactive: false,
        reducedMotion: false,
        inputLength: 6,
        generatedLength: 0,
    };
}

function setCubes(cubes: IBlkDef[] | undefined, opacity: number, highlight: number) {
    if (!cubes) return;
    for (let c of cubes) {
        if (c.opacity === 0 && highlight === 0) continue;
        c.opacity = opacity;
        c.highlight = highlight;
    }
}

export function applyDeveloStage(state: IProgramState) {
    let layout = state.layout;
    if (!layout) return;

    let p = state.stageProgress;
    let stage = state.stage;

    for (let c of layout.cubes) {
        c.opacity = 0.28;
        c.highlight = 0;
    }

    state.display.tokenIdxModelOpacity = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];

    function raise(cubes: IBlkDef[] | undefined, hl = 0.65) {
        if (!cubes) return;
        for (let c of cubes) {
            if (!c) continue;
            c.opacity = 1;
            c.highlight = hl;
        }
    }

    if (stage === "tokens") {
        raise([layout.idxObj], 0.9);
        layout.idxObj.opacity = 1;
    } else if (stage === "embedding") {
        raise([layout.tokEmbedObj, layout.posEmbedObj, layout.residual0], 0.7);
    } else if (stage === "qkv") {
        let block = layout.blocks[0];
        let headCount = p < 0.55 ? 1 : 3;
        if (block && block.heads) {
            for (let i = 0; i < Math.min(headCount, block.heads.length); i++) {
                let h = block.heads[i];
                raise([h.qBlock, h.kBlock, h.vBlock, h.qWeightBlock, h.kWeightBlock, h.vWeightBlock], i === 0 ? 0.85 : 0.55);
            }
        }
    } else if (stage === "attention") {
        let block = layout.blocks[0];
        if (block && block.heads) {
            for (let h of block.heads) {
                raise([h.attnMtx, h.attnMtxSm, h.attnMtxAgg1, h.attnMtxAgg2, h.vOutBlock], 0.9);
            }
        }
    } else if (stage === "transformer") {
        for (let b of layout.blocks) {
            raise(b.cubes, 0.45);
            raise([b.attnResidual, b.mlpResidual].filter(Boolean) as IBlkDef[], 0.7);
        }
    } else if (stage === "output") {
        raise([layout.ln_f.lnResid, layout.lmHeadWeight, layout.logits, layout.logitsSoftmax].filter(Boolean) as IBlkDef[], 0.85);
    } else if (stage === "prediction") {
        raise([layout.logitsSoftmax, layout.idxObj].filter(Boolean) as IBlkDef[], 0.8);
    } else {
        for (let c of layout.cubes) {
            c.opacity = 1;
            c.highlight = 0;
        }
    }
}

export function runProgram(view: IRenderView, state: IProgramState) {
    let timer0 = performance.now();

    if (!state.render) {
        return;
    }

    resetRenderBuffers(state.render);
    state.render.sharedRender.activePhase = RenderPhase.Opaque;
    state.display.lines = [];
    state.display.hoverTarget = null;
    if (!state.display.tokenColors) state.display.tokenColors = null;
    if (!state.display.tokenIdxColors) state.display.tokenIdxColors = null;

    if (state.wasmGptModel && state.jsGptModel) {
        syncWasmDataWithJsAndGpu(state.wasmGptModel, state.jsGptModel);
    }

    if (state.stepModel && state.wasmGptModel && state.jsGptModel) {
        state.stepModel = false;
        stepWasmModel(state.wasmGptModel, state.jsGptModel);
        state.generatedLength = Math.max(0, (state.jsGptModel.inputLen || 6) - 6);
    }

    state.layout = genGptModelLayout(state.shape, state.jsGptModel);
    applyDeveloStage(state);

    genModelViewMatrices(state, state.layout!);

    let queryRes = beginQueryAndGetPrevMs(state.render.queryManager, 'render');
    if (isNotNil(queryRes)) {
        state.render.lastGpuMs = queryRes;
    }

    state.render.renderTiming = false;

    updateCamera(state, view);

    drawAllArrows(state.render, state.layout);
    drawModelCard(state, state.layout, 'nano-gpt', new Vec3());
    drawTokens(state.render, state.layout, state.display, undefined, 6);

    state.render.sharedRender.activePhase = RenderPhase.Opaque;
    drawBlockLabels(state.render, state.layout);

    renderModel(state);

    endQuery(state.render.queryManager, 'render');
    state.render.gl.flush();

    state.render.lastJsMs = performance.now() - timer0;
}
