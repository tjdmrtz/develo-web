// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough00_Intro.tsx (no React, commentary, or sidebar).

import { findSubBlocks, splitGrid } from "../Annotations";
import { clamp, makeArray } from "@/src/utils/data";
import { Dim, Vec3, Vec4 } from "@/src/utils/vector";
import { DimStyle, dimStyleColor } from "../walkthrough/WalkthroughTools";
import { processUpTo } from "./DeveloProcessFlow";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, moveCameraTo, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloIntro(args: IDeveloWalkthroughArgs) {
    let { afterTime } = args.tools;
    let { state, layout, walkthrough: wt } = args;

    setInitialCamera(state, new Vec3(184.744, 0.000, -636.820), new Vec3(296.000, 16.000, 13.500));

    if (wt.time > 0) {
        for (let cube of layout.cubes) {
            if (cube.t === 'i' && cube.access) {
                cube.access.disable = true;
            }
        }
        state.display.tokenIdxModelOpacity = makeArray(6, 0);
    }

    let t4 = afterTime(null, 1.5, 0.4);

    moveCameraTo(args.state, t4, new Vec3(5.450, 0.000, 7.913), new Vec3(281.500, 12.500, 0.519));
    let t6 = afterTime(null, 1.0, 0.2);

    if (t4.active) {
        state.display.topOutputOpacity = 0.2;
    }

    if (t6.active && t6.t < 1.0) {
        let mixes = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) {
            let highT = (i + 1.5) / 8;
            mixes[i] = 1.0 - clamp(Math.abs(t6.t - highT) * 4, 0, 1);
        }
        state.display.tokenColors = { mixes, color2: dimStyleColor(DimStyle.Token) };
    }

    let t7 = afterTime(null, 1.5, 0.5);

    if (t7.active) {
        let opacity = makeArray(6, 0);
        for (let i = 0; i < 6; i++) {
            let highT = (i + 1.5) / 8;
            opacity[i] = clamp((t7.t - highT) * 4, 0, 1);
        }
        state.display.tokenIdxColors = { mixes: opacity, color2: dimStyleColor(DimStyle.TokenIdx) };

        let idxPos = t7.t * 6;

        if (t7.t < 1.0) {
            splitGrid(layout, layout.idxObj, Dim.X, idxPos, clamp(6 - idxPos, 0, 1));
            for (let blk of findSubBlocks(layout.idxObj, Dim.X, null, Math.min(5, Math.floor(idxPos)))) {
                if (blk.access) {
                    blk.access.disable = false;
                }
            }
        } else {
            if (layout.idxObj.access) {
                layout.idxObj.access.disable = false;
            }
        }
    }

    let t_camMove = afterTime(null, 1.0, 0.5);
    let t_makeVecs = afterTime(null, 2.0, 0.5);

    moveCameraTo(state, t_camMove, new Vec3(14.1, 0, -30.4), new Vec3(286, 14.5, 0.8));

    if (t_makeVecs.active) {
        let idxPos = t_makeVecs.t * 6;
        let splitWidth = clamp(6 - idxPos, 0, 2);
        let splitIdx = Math.min(5, Math.floor(idxPos));
        if (t_makeVecs.t < 1.0) {
            splitGrid(layout, layout.idxObj, Dim.X, idxPos, splitWidth);
            for (let blk of findSubBlocks(layout.idxObj, Dim.X, null, splitIdx)) {
                if (blk.access) {
                    blk.access.disable = false;
                }
            }

            splitGrid(layout, layout.residual0, Dim.X, idxPos, splitWidth);
            for (let blk of findSubBlocks(layout.residual0, Dim.X, null, splitIdx)) {
                if (blk.access) {
                    blk.access.disable = false;
                }
            }
        } else {
            if (layout.residual0.access) {
                layout.residual0.access.disable = false;
            }
        }
    }

    let t_firstResid = afterTime(null, 1.0, 0.5);
    moveCameraTo(state, t_firstResid, new Vec3(-23.160, 0.000, -128.380), new Vec3(292.300, 26.800, 2.400));
    let t_firstResidWalk = afterTime(null, 5.0, 0.5);

    let processState = processUpTo(state, t_firstResidWalk, layout.blocks[0].attnResidual);

    let t_firstTransformer = afterTime(null, 1.0, 0.5);
    moveCameraTo(state, t_firstTransformer, new Vec3(-78.7, 0, -274.2), new Vec3(299.4, 14.7, 4.3));
    let t_firstTransformerWalk = afterTime(null, 3.5, 0.5);
    processUpTo(state, t_firstTransformerWalk, layout.blocks[0].mlpResidual, processState);

    if (t_firstTransformer.active) {
        layout.blocks[0].transformerLabel.visible = t_firstTransformer.t;
    }

    let t_fullFrame = afterTime(null, 1.0, 0.5);
    moveCameraTo(state, t_fullFrame, new Vec3(-147, 0, -744.1), new Vec3(298.5, 23.4, 12.2));
    let t_fullFrameWalk = afterTime(null, 5.0, 0.5);
    processUpTo(state, t_fullFrameWalk, layout.ln_f.lnResid, processState);

    let t_output = afterTime(null, 1.0, 0.5);
    moveCameraTo(state, t_output, new Vec3(-58.4, 0, -1654.9), new Vec3(271.3, 6.4, 1.1));
    let t_outputWalk = afterTime(null, 2.0, 0.5);
    processUpTo(state, t_outputWalk, layout.logitsSoftmax, processState);

    let t_outputToks = afterTime(null, 1.0, 0.5);

    if (t_firstResid.active) {
        let arr = makeArray(6, 0);

        if (t_outputToks.active) {
            for (let i = 0; i < 6; i++) {
                let highT = (i + 1.5) / 8;
                arr[i] = clamp((t_outputToks.t - highT) * 4, 0, 1);
            }
        }

        state.display.tokenOutputColors = { color1: new Vec4(0,0,0,0), color2: Vec4.fromHexColor('#000', 1), mixes: arr };
    }

    if (t_firstResid.active) {
        setMathCue(state, "intro_flow");
    } else if (t_makeVecs.active || t_camMove.active) {
        setMathCue(state, "intro_embedding");
    } else if (t7.active) {
        setMathCue(state, "intro_indices");
    } else if (t6.active) {
        setMathCue(state, "intro_tokens");
    }
}
