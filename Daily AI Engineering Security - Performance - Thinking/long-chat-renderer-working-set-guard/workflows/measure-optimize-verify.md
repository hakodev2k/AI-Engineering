# Workflow: Measure → Diagnose → Optimize → Verify

## Trigger
Renderer regression, long-chat complaint, tool-output UI change, or pre-release performance review.

## Goal
Keep conversation rendering within bounded memory and frame-time budgets as chats grow.

## Inputs
Benchmark corpus, baseline build, candidate build, budgets, profiler access.

## Baseline
Capture at least two message-count checkpoints before implementation. Record renderer RSS, rendered nodes, and p95 frame time.

## Stages
1. **Observe:** reproduce the degradation with a fixed corpus.
2. **Measure baseline:** collect metrics and growth slopes.
3. **Diagnose:** attribute growth to nodes, retained resources, layout/paint, highlighting, or compositor behavior.
4. **Hypothesize:** write a falsifiable expected metric change.
5. **Optimize:** implement one targeted change.
6. **Measure again:** repeat identical checkpoints.
7. **Improved?** If no, revise hypothesis; maximum three cycles. If yes, continue.
8. **Verify:** run deterministic guard, correctness/accessibility checks, and independent review.
9. **Complete:** store before/after evidence and remaining risks.

## Responsible agent
Performance investigator for stages 1–7; independent reviewer for stage 8.

## Tools
Electron/Chromium profiler, OS metrics, UI benchmark harness, `scripts/render_budget_guard.py`.

## Outputs
Baseline, candidate results, diagnosis, implementation evidence, verification decision.

## Checkpoints
After baseline, after each candidate measurement, before final verification.

## Metrics
RSS, nodes, p95 frame time, growth slopes, relative regression.

## Retry policy
Maximum three optimization retries. A retry must change the hypothesis or implementation based on evidence.

## Stop conditions
Pass all budgets and correctness checks, or stop blocked after retry exhaustion.

## Failure path
Keep the safer implementation, preserve measurements, and escalate. Do not discard required transcript state or accessibility support to force a pass.

## Definition of Done
Baseline and candidate comparable; metrics collected; budgets pass; content/navigation/accessibility preserved; independent review complete.