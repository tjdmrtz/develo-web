// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Slimmed for Develo: DimStyle/color helpers only (no walkthrough UI).

import { Vec4 } from "@/src/utils/vector";

export enum DimStyle {
    None,
    t,
    T,
    C,
    B,
    A,
    n_vocab,
    n_heads,
    n_layers,
    Token,
    TokenIdx,
    C4,
    Intermediates,
    Weights,
    Aggregates,
}

export function dimStyleColor(style: DimStyle) {
     switch (style) {
        case DimStyle.t:
        case DimStyle.T:
            return Vec4.fromHexColor('#38bdf8');
        case DimStyle.A:
            return Vec4.fromHexColor('#7dd3fc');
        case DimStyle.C:
        case DimStyle.C4:
            return Vec4.fromHexColor('#0284c7');
        case DimStyle.Token:
            return Vec4.fromHexColor('#38bdf8');
        case DimStyle.TokenIdx:
            return Vec4.fromHexColor('#94a3b8');
        case DimStyle.n_vocab:
            return Vec4.fromHexColor('#34d399');
        case DimStyle.Intermediates:
            return Vec4.fromHexColor('#34d399');
        case DimStyle.Weights:
            return Colors.Weights;
        case DimStyle.Aggregates:
            return Vec4.fromHexColor('#38bdf8');
    }
    return new Vec4(0,0,0);
}

export function dimStyleText(style: DimStyle) {
    switch (style) {
        case DimStyle.TokenIdx: return 'Token Index';
        case DimStyle.C4: return 'C * 4';
        default: return DimStyle[style];
    }
}

export function dimStyleTextShort(style: DimStyle) {
    switch (style) {
        case DimStyle.B: return 'b';
        case DimStyle.T: return 't';
        case DimStyle.A: return 'a';
        case DimStyle.C: return 'c';
        case DimStyle.C4: return 'c';
        default: return DimStyle[style];
    }
}

export const Colors = {
    Weights: Vec4.fromHexColor('#0284c7'),
    Intermediates: Vec4.fromHexColor('#34d399'),
    Aggregates: Vec4.fromHexColor('#38bdf8'),
    Black: new Vec4(0, 0, 0),
};
