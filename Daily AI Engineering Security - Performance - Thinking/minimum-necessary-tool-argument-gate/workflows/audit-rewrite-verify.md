# Workflow: Audit → Rewrite → Verify

## Trigger
A new external tool integration, policy change, privacy incident, or representative agent trace containing outbound tool arguments.

## Goal
Reduce unnecessary sensitive disclosure without changing required tool behavior.

## Inputs
Representative tool-call corpus, tool schemas, task expectations, trust-boundary map, policy configuration.

## Baseline
Measure field count, sensitive-field count, sensitive-character count, current allow/block behavior, and task-validity rate before modification.

## Context
Record Facts, Assumptions, Evidence, Hypothesis, Decision, Risks, and Verification status. Do not request hidden chain-of-thought.

## Stages
1. **Observe** — collect representative calls and identify destinations.
2. **Measure baseline** — quantify sensitive exposure and current task validity.
3. **Diagnose** — map excess disclosure to missing field policy, contaminated free text, telemetry, or missing trust-boundary metadata.
4. **Form hypothesis** — state which deterministic transformations should reduce exposure while preserving semantics.
5. **Implement** — configure policy and integrate `scripts/tool_arg_minimizer.py` before external execution.
6. **Measure again** — replay the same corpus.
7. **Compare** — require lower exposure and non-regressing required behavior.
8. **Independent verification** — Privacy Reviewer checks evidence and exception decisions.

## Responsible agent
Implementation owner performs stages 1–7. `subagents/privacy-reviewer.md` performs stage 8.

## Tools
Local replay harness, sanitizer script, unit tests, schema validator, protected test fixtures.

## Outputs
Baseline report, policy, transformed corpus, test results, exposure comparison, reviewer verdict.

## Checkpoints
- Before implementation: baseline exists.
- Before external replay: no production credentials in fixtures.
- Before completion: independent verdict exists.

## Metrics
Sensitive fields/call, sensitive characters/call, task-validity rate, review rate, false positives, blocked secrets.

## Retry policy
Maximum two automatic rewrite/configuration iterations.

## Stop conditions
Stop on verified improvement, unresolved semantic ambiguity after two attempts, any authorization-risk regression, or failed independent review.

## Failure path
Restore the last known-good policy, block uncertain external transmissions, retain local evidence, and escalate to a human security owner.

## Verification
A result is verified only when replay uses the same representative workload, privacy exposure decreases, required outputs remain equivalent, and the independent reviewer signs off.

## Definition of Done
Baseline and post-change metrics exist; tests pass; no blocked secrets leave the boundary; required semantics pass; risks and approvals are documented; reviewer verdict is `verified`.
