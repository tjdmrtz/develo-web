// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Slimmed for Develo: DimStyle/color helpers only (no walkthrough UI).

import { DEVELO_LLM_VIZ_THEME as T } from "../../../../theme";

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
            return T.token;
        case DimStyle.A:
            return T.v;
        case DimStyle.C:
        case DimStyle.C4:
            return T.embedding;
        case DimStyle.Token:
            return T.token;
        case DimStyle.TokenIdx:
            return T.muted;
        case DimStyle.n_vocab:
            return T.mlp;
        case DimStyle.Intermediates:
            return T.mlp;
        case DimStyle.Weights:
            return Colors.Weights;
        case DimStyle.Aggregates:
            return T.attention;
    }
    return T.text;
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
    Weights: T.embedding,
    Intermediates: T.mlp,
    Aggregates: T.attention,
};
