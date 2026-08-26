// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Visual-only timer/camera helpers (no commentary, breakAfter, or sidebar).

import { clamp } from "@/src/utils/data";
import { Vec3 } from "@/src/utils/vector";
import { IProgramState } from "../Program";
import type { IDeveloWalkthrough } from "./DeveloWalkthrough";

export interface IDeveloTimeInfo {
    name: string;
    start: number;
    duration: number;
    wait: number;
    t: number;
    active: boolean;
}

export interface ICameraPos {
    center: Vec3;
    angle: Vec3;
}

export interface IDeveloWalkthroughArgs {
    state: IProgramState;
    layout: IProgramState["layout"];
    walkthrough: IDeveloWalkthrough;
    tools: ReturnType<typeof phaseTools>;
}

export function createAtTime(walkthrough: IDeveloWalkthrough, start: number, duration?: number, wait?: number): IDeveloTimeInfo {
    duration = duration ?? 0;
    wait = wait ?? 0;
    let info: IDeveloTimeInfo = {
        name: "",
        start,
        duration,
        wait,
        t: duration === 0 ? (walkthrough.time > start ? 1 : 0) : clamp((walkthrough.time - start) / duration, 0, 1),
        active: walkthrough.time > start,
    };
    walkthrough.times.push(info);
    walkthrough.phaseLength = Math.max(walkthrough.phaseLength, start + duration + wait);
    return info;
}

export function atTime(walkthrough: IDeveloWalkthrough, start: number, duration?: number, wait?: number): IDeveloTimeInfo {
    return createAtTime(walkthrough, start, duration, wait);
}

export function afterTime(walkthrough: IDeveloWalkthrough, prev: IDeveloTimeInfo | null, duration: number, wait?: number): IDeveloTimeInfo {
    prev = prev ?? walkthrough.times[walkthrough.times.length - 1] ?? { name: "", start: 0, duration: 0, wait: 0, t: 0, active: false };
    return atTime(walkthrough, prev.start + prev.duration + prev.wait, duration, wait);
}

export function cleanup(walkthrough: IDeveloWalkthrough, t: IDeveloTimeInfo, times?: IDeveloTimeInfo[]): void {
    let list = times ?? walkthrough.times;
    if (t.t > 0.0) {
        for (let prevTime of list) {
            prevTime.t = 1.0 - t.t;
            if (t.t >= 1.0) {
                prevTime.active = false;
            }
        }
    }
}

function getPhaseTransitiveData(wt: IDeveloWalkthrough) {
    wt.phaseTransitiveData ??= {};
    return wt.phaseTransitiveData;
}

export function setInitialCamera(state: IProgramState, target: Vec3, rot: Vec3): void {
    let wt = state.walkthrough;
    wt.cameraInitial = { angle: rot, center: target };

    let data = getPhaseTransitiveData(wt);

    if (wt.time === 0 && wt.running) {
        data.cameraSrc ??= { angle: state.camera.angle, center: state.camera.center };
        data.cameraT ??= 0;

        if (data.cameraT < 1) {
            let src = data.cameraSrc as ICameraPos;
            let dest = wt.cameraInitial;
            let t = data.cameraT;
            state.camera.angle = src.angle.lerp(dest.angle, t);
            state.camera.center = src.center.lerp(dest.center, t);

            data.cameraT = t + wt.viewDt / 1000 * 1.5;
            wt.markDirty();
        }
    }
}

export function moveCameraTo(state: IProgramState, time: IDeveloTimeInfo, target: Vec3, rot: Vec3): void {
    let wt = state.walkthrough;
    let phaseData = wt.phaseData.get(wt.phase);
    if (!phaseData) {
        wt.phaseData.set(wt.phase, phaseData = { cameraData: null });
    }
    if (!phaseData.cameraData) {
        phaseData.cameraData = new Map<number, { initialCaptured?: ICameraPos; target: ICameraPos }>();
    }

    let prevTime = [...phaseData.cameraData.entries()].filter(([t]) => t < time.start).pop()?.[1];

    let camData = phaseData.cameraData.get(time.start);
    if (!camData) {
        phaseData.cameraData.set(time.start, camData = {
            initialCaptured: prevTime ? undefined : wt.cameraInitial ?? {
                angle: state.camera.angle,
                center: state.camera.center,
            },
            target: { angle: rot, center: target },
        });
    }

    let src = prevTime?.target ?? wt.cameraInitial ?? camData.initialCaptured;

    let dest: ICameraPos = {
        center: target,
        angle: rot,
    };

    let isMoving = wt.running || wt.time !== wt.prevTime;
    let prevWasActive = wt.prevTime >= time.start && wt.prevTime <= time.start + time.duration;

    if (src && isMoving && (time.active || prevWasActive)) {
        let t = time.t;
        state.camera.angle = src.angle.lerp(dest.angle, t);
        state.camera.center = src.center.lerp(dest.center, t);
    }
}

export function phaseTools(state: IProgramState) {
    let phaseState = state.walkthrough;

    function atTimeBound(start: number, duration?: number, wait?: number): IDeveloTimeInfo {
        return createAtTime(phaseState, start, duration, wait);
    }

    function afterTimeBound(prev: IDeveloTimeInfo | null, duration: number, wait?: number): IDeveloTimeInfo {
        return afterTime(phaseState, prev, duration, wait);
    }

    function cleanupBound(t: IDeveloTimeInfo, times?: IDeveloTimeInfo[]): void {
        cleanup(phaseState, t, times);
    }

    return { atTime: atTimeBound, afterTime: afterTimeBound, cleanup: cleanupBound };
}
