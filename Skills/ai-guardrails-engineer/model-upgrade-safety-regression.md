# Model Upgrade Safety Regression

## Purpose
Evaluate model changes affecting safety, classifiers, tools, or attack susceptibility.

## When to use
Use before model/version/decoding/fine-tune/provider changes.

## Inputs
Baseline/candidate, corpus, production slices, tools, cost/latency, requirements.

## Context to inspect
Inspect prompts, structured output, tool calling, context, refusal, multilingual behavior, provider filtering.

## Core knowledge
Model upgrades are behavior changes and higher capability can increase attack effectiveness. Compare system outcomes.

## Procedure
1. Freeze baseline.
2. Run regressions.
3. Compare critical cases.
4. Test injection/tools/disclosure/multi-turn.
5. Validate contracts.
6. Compare latency/cost.
7. Shadow traffic.
8. Investigate deltas.
9. Canary/rollback.
10. Update baseline after acceptance.

## Decision points
Reject aggregate gains that regress critical invariants.

## Common failure patterns
Newer-is-safer, normal-only tests, simultaneous policy/model changes, no baseline, ignored fallback differences.

## Verification
Risk-weighted side-by-side results.

## Expected output
Safety report and release decision.

## Stop conditions
Stop on critical regressions/incompatibility.