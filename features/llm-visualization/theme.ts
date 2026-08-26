// Develo theme adapter for the adapted bbycroft/llm-viz renderer.
//
// Values are copied from the site's existing CSS custom properties and the
// `.content` section rules in sitegen/assets.py. The visualization renders on
// top of the dark `.content` surface (#050505), so upstream's black-on-light
// label colors are replaced by their Develo on-dark equivalents.
//
//   --paper      #ffffff
//   --ink        #050505
//   --blue       #1d2cf3
//   --blue-soft  #676adb
//   --orange     #d8400e
//   .content p a           #969aff
//   .diagram code          #b8baff
//   .card p                rgba(255,255,255,.72) over #050505 -> #b9b9b9
//   .grid / .card borders  rgba(255,255,255,.58) over #050505 -> #969696

import { Vec4 } from "@/src/utils/vector";

export interface DeveloLlmVizTheme {
    text: Vec4;
    muted: Vec4;
    token: Vec4;
    embedding: Vec4;
    q: Vec4;
    k: Vec4;
    v: Vec4;
    attention: Vec4;
    residual: Vec4;
    mlp: Vec4;
    output: Vec4;
    border: Vec4;
    panel: Vec4;
}

export const DEVELO_LLM_VIZ_THEME: DeveloLlmVizTheme = {
    text: Vec4.fromHexColor("#ffffff"),
    muted: Vec4.fromHexColor("#b9b9b9"),
    token: Vec4.fromHexColor("#969aff"),
    embedding: Vec4.fromHexColor("#676adb"),
    q: Vec4.fromHexColor("#969aff"),
    k: Vec4.fromHexColor("#676adb"),
    v: Vec4.fromHexColor("#b8baff"),
    attention: Vec4.fromHexColor("#969aff"),
    residual: Vec4.fromHexColor("#b9b9b9"),
    mlp: Vec4.fromHexColor("#d8400e"),
    output: Vec4.fromHexColor("#ffffff"),
    border: Vec4.fromHexColor("#969696"),
    panel: Vec4.fromHexColor("#050505"),
};
