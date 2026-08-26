// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough09_Output.tsx plus Develo output intervals.

import { Vec3 } from "@/src/utils/vector";
import { processUpTo, startProcessBefore } from "./DeveloProcessFlow";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

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
    }

    if (t_logits.active) {
        processUpTo(state, t_logits, layout.logits, processInfo);
        setMathCue(state, "output_logits");
    }

    if (t_probabilities.active) {
        processUpTo(state, t_probabilities, layout.logitsSoftmax, processInfo);
        setMathCue(state, "output_probabilities");
    }

    if (t_nextToken.active) {
        setMathCue(state, "output_argmax");
        if (t_nextToken.t >= 0.5) {
            let phaseLocal = wt.phaseData.get(wt.phase) ?? {};
            if (!phaseLocal.predictionStepped) {
                phaseLocal.predictionStepped = true;
                wt.phaseData.set(wt.phase, phaseLocal);
                state.stepModel = true;
            }
        }
    }
}
