# Workflow — Measure, Normalize, Verify Token Telemetry

## Trigger
Token-accounting change, compaction regression, unexplained usage, provider migration, or a new automation that consumes token counters.

## Goal
Ensure current-context decisions are driven by correctly named, measured, and validated telemetry.

## Inputs
Representative token-event JSONL, current field mapping, context-window size, estimator outputs, and policy.

## Baseline
Capture at least 20 representative events when available, including pre/post-compaction, long-running sessions, and multilingual/non-ASCII content. Record the existing compaction/alert decision for each event.

## Context
Cumulative consumption, active context occupancy, cached input, and estimated counts answer different questions and must remain separate.

## Stages
1. **Measure** — capture raw provider and local token fields without rewriting them.
2. **Diagnose** — map each field to canonical semantics and identify ambiguous consumers.
3. **Hypothesize** — state which wrong mapping or estimator is causing the observed decision error.
4. **Normalize** — emit canonical events with source provenance.
5. **Validate** — run `scripts/token_telemetry_guard.py` against the event set.
6. **Optimize/fix** — change only the mapping/estimator/consumer supported by evidence.
7. **Measure again** — replay the same baseline events and compare decisions and estimator error.
8. **Verify** — hand results to `subagents/telemetry-verifier.md`.

## Responsible agent
Platform/context engineer for stages 1–7; independent Telemetry Verifier for stage 8.

## Tools
Provider usage logs, local JSONL, Python 3, optional tokenizer measurements, and observability dashboards.

## Outputs
Canonical telemetry stream, violations report, estimator-error summary, before/after decision comparison, verification report.

## Checkpoints
- Before fixes: baseline and field semantics documented.
- Before enabling automation: zero blocking semantic violations.
- Before completion: independent replay verification.

## Metrics
Tokens/task, current-context utilization, cumulative usage, cached ratio, estimator relative error, compaction decision error rate, and telemetry violation count.

## Retry policy
Maximum 2 correction retries after the first measured fix. Each retry requires a failed replay or new evidence.

## Stop conditions
Stop after 3 measured fix attempts, when provider semantics cannot be determined, or when required current-context telemetry is unavailable. Disable unsafe automation and escalate.

## Failure path
Keep raw telemetry, mark ambiguous fields unsafe for automation, fall back to provider-documented measured fields or a validated tokenizer, and never silently substitute cumulative totals.

## Verification
Run `python3 scripts/test_token_telemetry_guard.py`; then replay production-like samples and independently compare before/after decisions.

## Definition of Done
Evidence documented; baseline captured; mappings explicit; validator passes; estimates never replace measured counts; context decisions use current-context values; metrics compared before/after; residual risks documented; independent verification complete.
