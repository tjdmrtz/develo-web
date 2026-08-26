// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual-only Develo walkthrough runner (no React, commentary, or sidebar).

import { IBlkDef } from "../GptModelLayout";
import { IProgramState } from "../Program";
import { IRenderView } from "../render/modelRender";
import { runDeveloEmbedding } from "./DeveloEmbedding";
import { runDeveloIntro } from "./DeveloIntro";
import { runDeveloLayerNorm } from "./DeveloLayerNorm";
import { runDeveloMlp } from "./DeveloMlp";
import { runDeveloOutput } from "./DeveloOutput";
import { runDeveloProjection } from "./DeveloProjection";
import { runDeveloSelfAttention } from "./DeveloSelfAttention";
import { runDeveloSoftmax } from "./DeveloSoftmax";
import { runDeveloTransformer } from "./DeveloTransformer";
import { ICameraPos, IDeveloTimeInfo, IDeveloWalkthroughArgs, phaseTools } from "./DeveloWalkthroughTools";

export type DeveloWalkthroughPhase =
    | "intro" | "embedding" | "layerNorm" | "selfAttention"
    | "projection" | "mlp" | "transformer" | "softmax" | "output";

export const DEVELO_WALKTHROUGH_PHASES: DeveloWalkthroughPhase[] = [
    "intro", "embedding", "layerNorm", "selfAttention",
    "projection", "mlp", "transformer", "softmax", "output",
];

export interface IDeveloWalkthrough {
    phase: DeveloWalkthroughPhase;
    phaseIndex: number;
    time: number;
    prevTime: number;
    dt: number;
    viewDt: number;
    running: boolean;
    speed: number;
    phaseLength: number;
    times: IDeveloTimeInfo[];
    phaseData: Map<string, any>;
    phaseTransitiveData: any;
    cameraInitial: ICameraPos | null;
    mathCue: string;
    complete: boolean;
    dimHighlightBlocks?: IBlkDef[] | null;
    markDirty(): void;
}

export function createDeveloWalkthrough(markDirty: () => void): IDeveloWalkthrough {
    return {
        phase: "intro",
        phaseIndex: 0,
        time: 0,
        prevTime: 0,
        dt: 0,
        viewDt: 0,
        running: false,
        speed: 1,
        phaseLength: 0,
        times: [],
        phaseData: new Map(),
        phaseTransitiveData: null,
        cameraInitial: null,
        mathCue: "",
        complete: false,
        dimHighlightBlocks: null,
        markDirty,
    };
}

export function startDeveloWalkthrough(state: IProgramState): void {
    state.inWalkthrough = true;
    state.walkthrough.running = true;
    state.walkthrough.complete = false;
    state.walkthrough.markDirty();
}

export function pauseDeveloWalkthrough(state: IProgramState): void {
    state.walkthrough.running = false;
    state.walkthrough.markDirty();
}

export function resetDeveloWalkthrough(state: IProgramState): void {
    let wt = state.walkthrough;
    wt.phase = "intro";
    wt.phaseIndex = 0;
    wt.time = 0;
    wt.prevTime = 0;
    wt.dt = 0;
    wt.running = false;
    wt.complete = false;
    wt.phaseLength = 0;
    wt.times = [];
    wt.phaseData.clear();
    wt.phaseTransitiveData = null;
    wt.cameraInitial = null;
    wt.mathCue = "";
    wt.dimHighlightBlocks = null;
    wt.markDirty();
}

export function getDeveloWalkthroughSnapshot(state: IProgramState) {
    let wt = state.walkthrough;
    return {
        phase: wt.phase,
        phaseIndex: wt.phaseIndex,
        time: wt.time,
        phaseLength: wt.phaseLength,
        running: wt.running,
        complete: wt.complete,
        speed: wt.speed,
        mathCue: wt.mathCue,
    };
}

export function setDeveloWalkthroughSpeed(state: IProgramState, speed: number): void {
    state.walkthrough.speed = speed;
}

export function setMathCue(state: IProgramState, cue: string): void {
    state.walkthrough.mathCue = cue;
}

function advancePhase(wt: IDeveloWalkthrough) {
    if (wt.phaseIndex >= DEVELO_WALKTHROUGH_PHASES.length - 1) {
        wt.running = false;
        wt.complete = true;
        return;
    }
    wt.phaseIndex += 1;
    wt.phase = DEVELO_WALKTHROUGH_PHASES[wt.phaseIndex];
    wt.time = 0;
    wt.prevTime = 0;
    wt.phaseData.delete(wt.phase);
    wt.phaseTransitiveData = null;
    wt.mathCue = "";
}

export function runDeveloWalkthrough(view: IRenderView, state: IProgramState): void {
    let wt = state.walkthrough;
    let dtMs = view.dt || 16;
    wt.viewDt = dtMs;
    wt.dt = 0;

    if (wt.running) {
        let dtSeconds = dtMs * wt.speed / 1000;
        wt.time += dtSeconds;
        wt.dt = dtSeconds;
        view.markDirty();
    }

    wt.times = [];
    wt.phaseLength = 0;
    wt.dimHighlightBlocks = null;

    let args: IDeveloWalkthroughArgs = {
        state,
        layout: state.layout,
        walkthrough: wt,
        tools: phaseTools(state),
    };

    switch (wt.phase) {
        case "intro": runDeveloIntro(args); break;
        case "embedding": runDeveloEmbedding(args); break;
        case "layerNorm": runDeveloLayerNorm(args); break;
        case "selfAttention": runDeveloSelfAttention(args); break;
        case "projection": runDeveloProjection(args); break;
        case "mlp": runDeveloMlp(args); break;
        case "transformer": runDeveloTransformer(args); break;
        case "softmax": runDeveloSoftmax(args); break;
        case "output": runDeveloOutput(args); break;
    }

    if (wt.running && wt.phaseLength > 0 && wt.time >= wt.phaseLength) {
        advancePhase(wt);
    }

    wt.prevTime = wt.time;
}
