// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough05_Softmax.tsx (camera hold only).

import { Vec3 } from "@/src/utils/vector";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloSoftmax(args: IDeveloWalkthroughArgs) {
    let { state, tools: { afterTime } } = args;

    setInitialCamera(state, new Vec3(-24.350, 0.000, -1702.195), new Vec3(283.100, 0.600, 1.556));
    afterTime(null, 3.0);
    setMathCue(state, "softmax_stable");
}
