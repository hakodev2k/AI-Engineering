# Workflow: Measure and Integrate

## Trigger
A tool-output path is suspected of causing context waste, loss, or repeated re-execution.

## Goal
Reduce context cost while preserving exact recoverability.

## Inputs
Task corpus, raw outputs, current thresholds, trace metrics, model/context constraints.

## Baseline
Capture tokens/task, bytes/tool result, tool re-runs/task, p50/p95 latency, context-limit failures, and evidence-recovery success.

## Context
Map: tool generation → per-tool caps → serialization → persistence → message compaction → model request → retrieval.

## Stages
1. **Observe** representative failures and sizes.
2. **Measure baseline** on at least one normal and one oversized fixture.
3. **Diagnose** the earliest destructive stage or raw-context amplification.
4. **Form hypothesis** with explicit expected metric movement.
5. **Implement improvement** by placing spill/index creation before reduction.
6. **Measure again** on the same fixtures.
7. **Compare** tokens, latency, re-runs, preservation, and quality.
8. **Verify** with an independent reviewer.

## Responsible agent
Implementation owner for stages 1–7; Context Preservation Reviewer for stage 8.

## Tools
`tool_output_spill.py`, unit tests, existing token/latency telemetry.

## Outputs
Baseline, spill envelope samples, before/after table, regression evidence, reviewer decision.

## Checkpoints
After baseline; before changing ordering; after first comparison; before completion.

## Metrics
Tokens/task, p95 latency, re-runs/task, preservation rate, retrieval success, quality/regression rate.

## Retry policy
At most 2 implementation hypotheses. Each retry must change an identified cause, not merely increase a limit.

## Stop conditions
Stop on data corruption, secret exposure, quality regression above acceptance criteria, or after 2 failed hypotheses.

## Failure path
Restore prior behavior, disable destructive reduction if it would lose evidence, and escalate with captured measurements.

## Verification
Reviewer reproduces digest recovery and verifies metrics from raw traces.

## Definition of Done
Baseline and comparison exist; full output is recoverable; budgets are bounded; tests pass; no critical context is lost; reviewer passes the package.
