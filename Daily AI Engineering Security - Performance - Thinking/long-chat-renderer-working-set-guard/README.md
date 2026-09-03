# Long-Chat Renderer Working-Set Guard

**Category:** Performance

## Problem
AI desktop clients can remain model-fast while their conversation renderer becomes progressively expensive as messages, code blocks, images, and tool output accumulate. The result can be multi-gigabyte renderer working sets, dropped frames, scroll stutter, and system-wide UI lag that ordinary model/API latency benchmarks never detect.

## Evidence
See `evidence/research.md`. Recent Codex desktop reports on Windows and macOS independently show long-chat rendering degradation, including renderer working-set growth and severe scrolling stutter without corresponding network or system-memory exhaustion.

## Existing approach
Users restart the app or open a new conversation; implementers use component memoization, collapsed tool output, lazy rendering, or list virtualization/windowing.

## Existing limitations
Restarting discards workflow continuity. Collapsing content may reduce one render cost but does not prove off-screen nodes are released. Generic UI benchmarks often use short synthetic conversations and miss growth slope over hundreds of messages or large tool outputs.

## Proposed improvement
Treat conversation rendering as a bounded working set. Benchmark multiple transcript sizes, measure visible DOM/render-node count, renderer RSS, scroll frame time, and growth slope, then block regressions that exceed configured budgets. Prefer windowing/virtualization and detached-content reclamation while preserving full transcript data outside the active render tree.

## Architecture
- `evidence/research.md` — current signals and root-cause analysis.
- `config/budgets.example.json` — measurable performance budgets.
- `examples/measurements.example.json` — representative benchmark data.
- `skills/renderer-scaling-investigation.md` — investigation procedure.
- `rules/render-budget-rules.md` — enforceable performance rules.
- `subagents/performance-reviewer.md` — independent verification role.
- `workflows/measure-optimize-verify.md` — bounded optimization workflow.
- `hooks/pre-release-render-budget.md` — blocking pre-release check.
- `scripts/render_budget_guard.py` — deterministic budget/regression checker.
- `tests/test_render_budget_guard.py` — regression tests.

## Installation
Python 3.10+ standard library only for the deterministic guard. UI measurement collection remains host-specific and should use the platform's browser/Electron profiling facilities.

## Configuration
Copy `config/budgets.example.json` and define thresholds appropriate to supported hardware. Measurements must use the same benchmark corpus and capture method for before/after comparisons.

## Usage
```bash
python scripts/render_budget_guard.py --budgets config/budgets.example.json --measurements examples/measurements.example.json
python -m unittest tests/test_render_budget_guard.py
```

## Workflow
Measure baseline → reproduce at multiple transcript sizes → identify whether render nodes, RSS, frame time, or tool-output materialization grows → form a specific hypothesis → implement windowing/reclamation or targeted optimization → measure again → independently verify.

## Metrics
Renderer RSS MB, rendered-node count, p95 frame time, scroll FPS, MB per 100 messages, nodes per 100 messages, and regression versus baseline.

## Verification
**Implemented:** renderer-bounding mechanism is present. **Measured:** before/after data exists at identical benchmark sizes. **Verified:** configured absolute budgets and regression limits pass, with no transcript correctness loss.

## Safety and correctness
Do not remove conversation data required for correctness merely to improve UI metrics. Virtualize presentation rather than deleting authoritative transcript state. Preserve accessibility semantics and navigation to off-screen content.

## Failure handling
A failing budget blocks performance verification. Retry optimization at most three times, changing the hypothesis each iteration. If budgets cannot be met without correctness or accessibility regression, retain the safer implementation and escalate the tradeoff.

## Definition of Done
Baseline captured; long-chat and large-tool-output cases measured; root cause documented; improvement implemented; absolute and relative budgets pass; transcript content remains retrievable; independent reviewer verifies evidence; no blocking regression remains.
