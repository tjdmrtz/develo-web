// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough05_Softmax.tsx (max → exp/sum → normalize).

import { Vec3 } from "@/src/utils/vector";
import { processUpTo, startProcessBefore } from "./DeveloProcessFlow";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloSoftmax(args: IDeveloWalkthroughArgs) {
    let { state, layout, tools: { afterTime } } = args;

    setInitialCamera(state, new Vec3(-24.350, 0.000, -1702.195), new Vec3(283.100, 0.600, 1.556));

    let t_max = afterTime(null, 0.85, 0.10);
    let t_expSum = afterTime(t_max, 0.95, 0.10);
    let t_normalize = afterTime(t_expSum, 1.00, 0.20);

    let processInfo = startProcessBefore(state, layout.logitsAgg2);
    processInfo = processUpTo(state, t_max, layout.logitsAgg2, processInfo);
    processInfo = processUpTo(state, t_expSum, layout.logitsAgg1, processInfo);
    processUpTo(state, t_normalize, layout.logitsSoftmax, processInfo);

    if (t_max.active) {
        setMathCue(state, "softmax_max");
    }
    if (t_expSum.active) {
        setMathCue(state, "softmax_exp_sum");
    }
    if (t_normalize.active) {
        setMathCue(state, "softmax_stable");
    }
}
