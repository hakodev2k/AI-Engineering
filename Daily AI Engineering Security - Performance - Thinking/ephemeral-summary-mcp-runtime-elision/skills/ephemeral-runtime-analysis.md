# Skill — Ephemeral Runtime Analysis
## Purpose
Find unnecessary runtime allocation and retained ownership in one-shot AI tasks.
## Trigger
Process/RSS growth correlated with summaries, titles, graders, internal helpers or other ephemeral generations.
## Inputs
Feature-tagged session events, effective MCP inventory, process/RSS snapshots, completion action, latency and quality measurements.
## Preconditions
A repeatable baseline workload and a way to identify the owning feature/session.
## Required context
Observable runtime/configuration data only; no hidden chain-of-thought.
## Allowed tools
Read-only logs, process inventory, profiler/benchmark commands, deterministic guard and unit tests.
## Constraints
Do not remove tools required for correctness. Do not kill unrelated processes. Do not infer ownership from process names alone when stronger identifiers exist.
## Procedure
1. Measure baseline process count, RSS, p50/p95 latency and output quality.
2. Correlate resource births with feature/session ownership.
3. Record whether the feature actually requests tools.
4. Compare configured MCP count with effective MCP count.
5. Inspect completion semantics: unsubscribe vs removal/shutdown.
6. Form a single root-cause hypothesis.
7. Apply resource-intent gating and repeat the same workload.
8. Independently verify quality and lifecycle cleanup.
## Decision points
If a tool-free one-shot task starts MCP, fix admission first. If resources remain after remove/shutdown, diagnose teardown separately rather than weakening the intent gate.
## Expected output
Facts, Evidence, Baseline, Hypothesis, Change, After metrics, Verification status.
## Metrics
Processes/session, RSS/session, retained sessions, cleanup latency, summary latency, quality regression rate.
## Verification
Same workload, same feature mix, bounded repetitions, independent metric review.
## Failure handling
Maximum two optimization hypotheses. Revert optimization if quality or required tool availability regresses.
## Stop conditions
Stop on ownership ambiguity, pending tool calls at disposal, or quality regression beyond threshold.
