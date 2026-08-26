// Copyright (c) 2023-2026 Brendan Bycroft. MIT License.
// Slimmed for Develo: no React.

export class Subscriptions {
    subs = new Set<() => void>();
    subscribe = (fn: () => void): (() => void) => {
        this.subs.add(fn);
        return () => this.subs.delete(fn);
    }
    notify = () => {
        for (let sub of this.subs) {
            sub();
        }
    }
}
