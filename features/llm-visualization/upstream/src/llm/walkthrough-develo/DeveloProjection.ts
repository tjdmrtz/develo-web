// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual port of Walkthrough06_Projection.tsx (no React, commentary, or sidebar).

import { Vec3 } from "@/src/utils/vector";
import { lerp, lerpSmoothstep } from "@/src/utils/math";
import { processUpTo, startProcessBefore } from "./DeveloProcessFlow";
import { setMathCue } from "./DeveloWalkthrough";
import { IDeveloWalkthroughArgs, moveCameraTo, setInitialCamera } from "./DeveloWalkthroughTools";

export function runDeveloProjection(args: IDeveloWalkthroughArgs) {
    let { walkthrough: wt, state, layout, tools: { afterTime, cleanup } } = args;

    setInitialCamera(state, new Vec3(-73.167, 0.000, -270.725), new Vec3(293.606, 2.613, 1.366));
    let block = layout.blocks[0];
    wt.dimHighlightBlocks = [...block.heads.map(h => h.vOutBlock), block.projBias, block.projWeight, block.attnOut];

    let t_fadeOut = afterTime(null, 1.0, 0.5);
    let t_stack = afterTime(null, 1.0);
    let t_process = afterTime(null, 3.0);
    let t_zoomOut = afterTime(null, 1.0, 0.5);
    let t_processResid = afterTime(null, 3.0);

    cleanup(t_zoomOut, [t_fadeOut, t_stack]);

    if (t_fadeOut.active) {
        for (let head of block.heads) {
            for (let blk of head.cubes) {
                if (blk !== head.vOutBlock) {
                    blk.opacity = lerpSmoothstep(1, 0, t_fadeOut.t);
                }
            }
        }
    }

    if (t_stack.active) {
        let targetZ = block.attnOut.z;
        for (let headIdx = 0; headIdx < block.heads.length; headIdx++) {
            let head = block.heads[headIdx];
            let targetY = head.vOutBlock.y + head.vOutBlock.dy * (headIdx - block.heads.length + 1);
            head.vOutBlock.y = lerp(head.vOutBlock.y, targetY, t_stack.t);
            head.vOutBlock.z = lerp(head.vOutBlock.z, targetZ, t_stack.t);
        }
    }

    let processInfo = startProcessBefore(state, block.attnOut);

    if (t_process.active) {
        processUpTo(state, t_process, block.attnOut, processInfo);
    }

    moveCameraTo(state, t_zoomOut, new Vec3(-8.304, 0.000, -175.482), new Vec3(293.606, 2.623, 2.618));

    if (t_processResid.active) {
        processUpTo(state, t_processResid, block.attnResidual, processInfo);
    }

    if (t_processResid.active) {
        setMathCue(state, "projection_residual");
    } else if (t_process.active) {
        setMathCue(state, "projection_linear");
    } else if (t_stack.active) {
        setMathCue(state, "projection_concat");
    }
}
