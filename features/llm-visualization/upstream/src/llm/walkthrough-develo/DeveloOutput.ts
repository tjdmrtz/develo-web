// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough09_Output.tsx plus Develo output intervals.

import { splitGrid } from "../Annotations";
import { IBlkDef } from "../GptModelLayout";
import { Dim, Vec3 } from "@/src/utils/vector";
import { processUpTo, startProcessBefore } from "./DeveloProcessFlow";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloTimeInfo, IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloOutput(args: IDeveloWalkthroughArgs) {
    let { walkthrough: wt, state, layout, tools: { afterTime } } = args;

    setInitialCamera(state, new Vec3(-20.203, 0.000, -1642.819), new Vec3(281.600, -7.900, 2.298));

    let t_finalNorm = afterTime(null, 0.8);
    let t_logits = afterTime(null, 0.8);
    let t_probabilities = afterTime(null, 1.2);
    let t_nextToken = afterTime(null, 1.2);

    let processInfo = startProcessBefore(state, layout.ln_f.lnResid);

    if (t_finalNorm.active) {
        processUpTo(state, t_finalNorm, layout.ln_f.lnResid, processInfo);
        setMathCue(state, "output_final_norm");
        emphasizeBlock(layout.ln_f.lnResid, t_finalNorm, 0.28);
    }

    if (t_logits.active) {
        processUpTo(state, t_logits, layout.logits, processInfo);
        setMathCue(state, "output_logits");
        emphasizeBlock(layout.logits, t_logits, 0.32);
    }

    if (t_probabilities.active) {
        processUpTo(state, t_probabilities, layout.logitsSoftmax, processInfo);
        setMathCue(state, "output_probabilities");
        emphasizeBlock(layout.logitsSoftmax, t_probabilities, 0.38);
    }

    if (t_nextToken.active) {
        setMathCue(state, "output_argmax");

        let phaseLocal = wt.phaseData.get(wt.phase) ?? {};

        if (!phaseLocal.outputSelection) {
            const model = state.jsGptModel;
            if (model && model.sortedBuf) {
                const vocabSize = model.shape.vocabSize;
                const tIdx = Math.max(0, model.inputLen - 1);
                const sortedIndex = (tIdx * vocabSize) * 2;
                const tokenId = Math.round(model.sortedBuf[sortedIndex]);
                phaseLocal.outputSelection = { tIdx, tokenId };
                wt.phaseData.set(wt.phase, phaseLocal);
            }
        }

        const selection = phaseLocal.outputSelection;
        if (selection) {
            const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, t_nextToken.t)));
            const splitAmount = 1.2 * pulse;
            const probabilityColumn = splitGrid(
                layout,
                layout.logitsSoftmax,
                Dim.X,
                selection.tIdx + 0.5,
                splitAmount,
            );
            if (probabilityColumn) {
                const selectedCell = splitGrid(
                    layout,
                    probabilityColumn,
                    Dim.Y,
                    selection.tokenId + 0.5,
                    splitAmount * 0.8,
                );
                if (selectedCell) {
                    selectedCell.highlight = Math.max(selectedCell.highlight ?? 0, 0.55 + 0.35 * pulse);
                }
                probabilityColumn.highlight = Math.max(probabilityColumn.highlight ?? 0, 0.25 + 0.20 * pulse);
            }
        }

        if (t_nextToken.t >= 0.72 && !phaseLocal.predictionStepped) {
            phaseLocal.predictionStepped = true;
            wt.phaseData.set(wt.phase, phaseLocal);
            state.stepModel = true;
        }
    }
}

function emphasizeBlock(block: IBlkDef, timer: IDeveloTimeInfo, strength = 0.32) {
    if (!timer.active) {
        return;
    }

    const t = Math.min(1, Math.max(0, timer.t));
    const pulse = Math.sin(Math.PI * t);
    block.highlight = Math.max(block.highlight ?? 0, 0.12 + pulse * strength);
}
