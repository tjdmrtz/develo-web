// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough08_Transformer.tsx (three-block process flow).

import { Vec3 } from "@/src/utils/vector";
import { processUpTo, startProcessBefore } from "./DeveloProcessFlow";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloTimeInfo, IDeveloWalkthroughArgs, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloTransformer(args: IDeveloWalkthroughArgs) {
    let { state, layout, tools: { afterTime } } = args;

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));
    setMathCue(state, "transformer_block");

    let t_block0 = afterTime(null, 0.85, 0.10);
    let t_block1 = afterTime(t_block0, 0.85, 0.10);
    let t_block2 = afterTime(t_block1, 0.85, 0.25);

    let processInfo = startProcessBefore(state, layout.blocks[0].ln1.lnResid);
    processInfo = processUpTo(state, t_block0, layout.blocks[0].mlpResidual, processInfo);
    processInfo = processUpTo(state, t_block1, layout.blocks[1].mlpResidual, processInfo);
    processUpTo(state, t_block2, layout.blocks[2].mlpResidual, processInfo);

    emphasizeTransformerBlock(layout.blocks[0], t_block0);
    emphasizeTransformerBlock(layout.blocks[1], t_block1);
    emphasizeTransformerBlock(layout.blocks[2], t_block2);
}

function emphasizeTransformerBlock(
    block: IDeveloWalkthroughArgs["layout"]["blocks"][number],
    timer: IDeveloTimeInfo,
) {
    if (!timer.active) {
        return;
    }

    const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, timer.t)));
    const highlight = 0.08 + pulse * 0.16;

    for (const cube of block.cubes) {
        cube.highlight = Math.max(cube.highlight ?? 0, highlight);
    }
}
