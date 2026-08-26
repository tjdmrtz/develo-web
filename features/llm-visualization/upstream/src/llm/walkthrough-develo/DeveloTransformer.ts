// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough08_Transformer.tsx (camera hold only).

import { Vec3 } from "@/src/utils/vector";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloTransformer(args: IDeveloWalkthroughArgs) {
    let { state, tools: { afterTime } } = args;

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));
    afterTime(null, 3.0);
    setMathCue(state, "transformer_block");
}
