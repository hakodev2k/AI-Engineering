# Skill: Renderer Scaling Investigation

## Purpose
Diagnose long-chat UI degradation using observable working-set and frame metrics.

## Trigger
Long-session UI lag, scroll stutter, renderer memory growth, large tool-output rendering, or conversation UI changes.

## Inputs
Fixed transcript corpus, message-count checkpoints, baseline build, candidate build, platform profiler output.

## Preconditions
Use identical corpus, viewport, zoom, hardware/power conditions, and capture procedure for baseline/candidate. Warm startup separately from steady-state measurements.

## Required context
Conversation rendering architecture, virtualization/windowing behavior, tool-output components, markdown/highlighting lifecycle, renderer process boundaries.

## Allowed tools
Electron/Chromium DevTools, OS process metrics, performance traces, DOM/render-tree counters, deterministic budget guard.

## Constraints
MUST preserve transcript correctness and accessibility. MUST NOT claim improvement from one screenshot or one short chat. MUST separate renderer cost from model/network latency.

## Procedure
1. Define small, medium, and large transcript checkpoints with representative tool output.
2. Measure baseline renderer RSS, rendered nodes, and p95 frame time at each checkpoint.
3. Compute growth per 100 messages.
4. Identify whether growth is dominated by retained nodes, rich-content materialization, repeated layout/highlighting, GPU/compositor work, or unrelated process activity.
5. State one falsifiable hypothesis.
6. Implement the smallest targeted optimization, preferring windowing/reclamation over data deletion.
7. Re-run identical measurements.
8. Run `scripts/render_budget_guard.py` and regression tests.
9. Verify off-screen transcript content remains retrievable and navigation/accessibility still works.
10. Hand off to an independent performance reviewer.

## Decision points
If node count stays bounded but RSS grows, investigate retained objects/resources. If RSS is bounded but frame time grows, investigate layout/paint/compositor work. If both stay bounded, investigate non-renderer processes before changing UI code.

## Expected output
Before/after scaling table, root-cause evidence, hypothesis result, pass/fail budget report.

## Metrics
RSS, nodes, p95 frame ms, FPS, growth slopes, regression percentage.

## Verification
At least two message-count checkpoints are required; candidate must meet absolute budgets and avoid unacceptable regression.

## Failure handling
Maximum three optimize/remeasure cycles. Every retry requires changed evidence or hypothesis.

## Stop conditions
Stop when budgets pass and correctness checks pass, or when retries are exhausted and the regression remains blocked.