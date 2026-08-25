import { DeveloLlmVizController } from "./controller.js";

const controllers = [];

function boot() {
  const roots = document.querySelectorAll("[data-llm-viz]");
  roots.forEach((root) => {
    if (root.__develoLlmViz) return;
    controllers.push(new DeveloLlmVizController(root));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

window.addEventListener("pagehide", () => {
  for (const c of controllers) c.destroy();
  controllers.length = 0;
});
