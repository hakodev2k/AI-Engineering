# Workflow: Measure, Migrate, Verify

## Trigger
Adoption of dynamic GPT-6 Astra reasoning effort, suspected prompt-cache regression, or framework/Codex upgrade affecting request/history construction.

## Goal
Preserve quality while changing effective reasoning effort without an unacceptable prompt-cache, token, cost, or latency regression.

## Inputs
Representative workload, turn-level usage telemetry, quality oracle, threshold configuration, and observable request/history representation.

## Baseline
Capture at least three stable turns before the change. Record input tokens, cached input tokens, latency, effective effort, request-level effort, quality pass/fail, and cost when available.

## Context
Use the same model, stable prompt prefix, comparable workload, and cache-retention conditions across baseline and post-change measurements.

## Stages
1. **Observe** — identify current request-level effort and how the host represents an effort transition.
2. **Measure baseline** — capture the required stable turns and quality evidence.
3. **Diagnose** — if current dynamic changes use request-level mutation, identify the host layer responsible.
4. **Form hypothesis** — predict that representing the change as a trusted `configuration_update` will preserve the reusable prefix without quality loss.
5. **Implement improvement** — wire the transition through the compatible configuration-update path; do not trim required context.
6. **Measure again** — capture at least two comparable post-change turns.
7. **Compare** — run `scripts/cache_transition_analyzer.py` with fixed thresholds.
8. **Improved?** — if no, re-evaluate one cause and retry; maximum two migration/retest cycles.
9. **Verify** — run unit tests and independent cache verification.

## Responsible agent
Integration owner implements; `subagents/cache-verifier.md` independently verifies.

## Tools
Responses API/application traces, provider usage telemetry, Python 3, package analyzer/tests, and workload-specific correctness tests.

## Outputs
Before/after telemetry, analyzer report, quality evidence, transition classification, and verification status.

## Checkpoints
Before implementation, after each measured transition, before changing thresholds, and before claiming Verified.

## Metrics
Tokens/task, cached-input ratio, uncached-input tokens, cost/task, latency, result quality, and regression rate.

## Retry policy
Maximum two rework cycles. Each retry must state a new evidence-backed cause; do not repeat unchanged experiments.

## Stop conditions
Stop when thresholds and quality pass, after two unsuccessful cycles, or immediately if preserving cache requires removing correctness/safety context.

## Failure path
Revert to the last verified configuration or a stable fixed effort, preserve telemetry, document the failing integration path, and escalate framework wiring defects.

## Verification
Implemented = configuration-update path is present. Measured = before/after telemetry is complete. Verified = transition evidence is correct, thresholds pass, quality passes, tests pass, and independent review accepts the result.

## Definition of Done
Evidence documented; baseline and post-change samples complete; existing limitation identified; transition implemented; analyzer/tests pass; quality preserved; metrics compared; risks documented; independent verification complete; no blocking regression remains.
