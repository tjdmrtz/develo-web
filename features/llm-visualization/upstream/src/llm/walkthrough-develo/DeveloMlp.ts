// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough07_Mlp.tsx (no React, commentary, ReluGraph, or sidebar).

import { Dim, Vec3 } from "@/src/utils/vector";
import { dimProps, findSubBlocks, splitGrid } from "../Annotations";
import { lerp } from "@/src/utils/math";
import { IBlkDef } from "../GptModelLayout";
import { processUpTo, startProcessBefore } from "./DeveloProcessFlow";
import { drawDataFlow } from "../components/DataFlow";
import { drawDependences } from "../Interaction";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloMlp(args: IDeveloWalkthroughArgs) {
    let { walkthrough: wt, state, layout, tools: { afterTime, cleanup } } = args;

    let block = layout.blocks[0];

    setInitialCamera(state, new Vec3(-154.755, 0.000, -460.042), new Vec3(289.100, -8.900, 2.298));
    wt.dimHighlightBlocks = [block.ln2.lnResid, block.mlpAct, block.mlpFc, block.mlpFcBias, block.mlpFcWeight, block.mlpProjBias, block.mlpProjWeight, block.mlpResult, block.mlpResidual];

    let t0_fadeOut = afterTime(null, 1.0);
    let t1_process = afterTime(null, 3.0);
    let t2_process = afterTime(null, 3.0);
    let t3_process = afterTime(null, 3.0);
    let t4_process = afterTime(null, 3.0);
    let t5_cleanup = afterTime(null, 1.0, 0.5);
    cleanup(t5_cleanup, [t0_fadeOut]);
    let t6_processAll = afterTime(null, 6.0);

    let targetIdx = 3;
    let inputBlk = block.ln2.lnResid;
    let mlp1Blk = block.mlpFc;
    let mlp2Blk = block.mlpAct;
    let mlpRes = block.mlpResult;
    let mlpResid = block.mlpResidual;

    function dimExceptVector(blk: IBlkDef, axis: Dim, disable: boolean) {
        if (t0_fadeOut.t === 0 || t6_processAll.t > 0) {
            return;
        }

        if (disable) {
            blk.access!.disable = true;
        }

        let col = splitGrid(layout, blk, axis, targetIdx + 0.5, lerp(0.0, 1.0, t0_fadeOut.t))!;

        for (let sub of blk.subs!) {
            sub.opacity = lerp(1.0, 0.2, t0_fadeOut.t);
        }

        col.opacity = 1.0;

        return col!;
    }

    dimExceptVector(inputBlk, Dim.X, false);
    let mlp1Col = dimExceptVector(mlp1Blk, Dim.Y, true);
    let mlp2Col = dimExceptVector(mlp2Blk, Dim.Y, true);
    let mlpResCol = dimExceptVector(mlpRes, Dim.X, true);
    let mplResIdCol = dimExceptVector(mlpResid, Dim.X, true);

    function processVector(blk: IBlkDef, col: IBlkDef | undefined, t: number, pinIdx: Vec3) {
        if (t === 0) {
            return;
        }

        let dim0 = blk.transpose ? Dim.Y : Dim.X;
        let dim1 = blk.transpose ? Dim.X : Dim.Y;
        let { cx: numCells } = dimProps(blk, dim1);

        let xPos = Math.floor(lerp(0, numCells, t));

        let destIdx = new Vec3().setAt(dim0, targetIdx).setAt(dim1, xPos).round_();

        if (col) {
            let row = splitGrid(layout, col, dim1, xPos, 0.0);
            for (let a of findSubBlocks(col, dim1, 0, xPos)) {
                a.access!.disable = false;
            }
            void row;
        }

        if (t < 1.0) {
            drawDataFlow(state, blk, destIdx, pinIdx);
            drawDependences(state, blk, destIdx);
        } else if (col) {
            col!.access!.disable = false;
        }
    }

    processVector(mlp1Blk, mlp1Col, t1_process.t, new Vec3(40));
    processVector(mlp2Blk, mlp2Col, t2_process.t, new Vec3(mlp1Blk.cx / 2, -15));
    processVector(mlpRes, mlpResCol, t3_process.t, new Vec3(mlpRes.cx / 2, -15));
    processVector(mlpResid, mplResIdCol, t4_process.t, new Vec3(mlpRes.cx / 2, -15));

    if (t5_cleanup.t > 0.4) {
        mlp1Blk.access!.disable = true;
        mlp2Blk.access!.disable = true;
        mlpRes.access!.disable = true;
        mlpResid.access!.disable = true;
    }

    if (t6_processAll.t > 0) {
        let prevInfo = startProcessBefore(state, inputBlk);
        processUpTo(state, t6_processAll, mlpResid, prevInfo);
    }

    if (t4_process.active) {
        setMathCue(state, "mlp_residual");
    } else if (t3_process.active) {
        setMathCue(state, "mlp_project");
    } else if (t2_process.active) {
        setMathCue(state, "mlp_gelu");
    } else if (t1_process.active) {
        setMathCue(state, "mlp_expand");
    } else if (t0_fadeOut.active) {
        setMathCue(state, "mlp_norm");
    }
}
