// Functional test for develo/js/main.js under Node with a minimal DOM stub.
// Verifies the year-in-footer functionality and the nav-toggle behavior.
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const jsPath = path.join(__dirname, "..", "develo", "js", "main.js");
assert.ok(fs.existsSync(jsPath), "develo/js/main.js must exist");

const elements = {
  year: { textContent: "" },
  "deploy-info": { textContent: "" },
};
const navButton = {
  "aria-expanded": "false",
  listeners: {},
  addEventListener(type, fn) { this.listeners[type] = fn; },
  getAttribute(name) { return this[name] ?? null; },
  setAttribute(name, value) { this[name] = value; },
};
const navMenu = {};

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelector: (sel) =>
    sel === "[data-nav-toggle]" ? navButton : sel === "[data-nav-menu]" ? navMenu : null,
};
// NOTE: `window` is intentionally NOT defined -> main.js must degrade gracefully.

// Load the site script.
require(jsPath);

// 1. Year in footer
const expectedYear = String(new Date().getFullYear());
assert.strictEqual(
  elements.year.textContent,
  expectedYear,
  `footer #year must show current year, got ${JSON.stringify(elements.year.textContent)}`
);

// 2. Nav toggle flips aria-expanded on click
assert.strictEqual(typeof navButton.listeners.click, "function", "nav toggle must register a click handler");
navButton.listeners.click();
assert.strictEqual(navButton["aria-expanded"], "true", "click must open the nav");
navButton.listeners.click();
assert.strictEqual(navButton["aria-expanded"], "false", "second click must close the nav");

// 3. No crash without window/fetch (deploy-info stays untouched)
assert.strictEqual(elements["deploy-info"].textContent, "");

console.log("OK: main.js functional tests passed");
