# Workflow — Measure, Classify, Optimize, Verify

## Trigger
A retry/stream/fallback latency problem or any proposed change to agent retry semantics.

## Goal
Reduce unnecessary model/transport attempts and tail latency while preserving task completion and correctness.

## Inputs
Representative workload, baseline traces, normalized event types, current retry/fallback configuration.

## Baseline
Before changes, record: p50/p95/p99 end-to-end latency, attempts per logical turn, cumulative retry wait, time-to-fallback, terminal-state retry count, successful completion rate, and tokens per successful task when available.

## Context
Use `evidence/research.md`, `rules/retry-policy.md`, and `skills/retry-trace-analysis.md`.

## Stages
1. **Observe** — collect traces with logical turn IDs spanning all attempts/transports.
2. **Measure baseline** — compute required metrics and retain raw evidence.
3. **Diagnose** — identify semantic terminal events being retried, duplicated retry layers, or fixed-timeout amplification.
4. **Form hypothesis** — choose one policy change and expected metric effect.
5. **Implement improvement** — encode normalized outcome in `scripts/retry_classifier.py` or equivalent host adapter.
6. **Measure again** — replay the same workload/configuration envelope.
7. **Improved?** — if no, re-evaluate the hypothesis; maximum two policy revisions. If yes, continue.
8. **Independent verify** — Performance Verifier compares success/correctness and latency/retry metrics.
9. **Complete** — separately mark Implemented, Measured, Verified.

## Responsible agent
Performance investigator: stages 1–7. Independent Performance Verifier: stage 8.

## Tools
Trace/log query, metrics aggregation, `python scripts/retry_classifier.py`, `python -m unittest tests/test_retry_classifier.py`.

## Outputs
Baseline, diagnosis, hypothesis, policy delta, post-change metrics, comparison, verifier decision.

## Checkpoints
Baseline captured before implementation; classifier tests before replay; post-change comparison before acceptance.

## Metrics
p95 latency, attempts/turn, cumulative wait, fallback time, false-terminal retries, success rate, tokens/task.

## Retry policy
Investigation loop maximum 2 revisions. Runtime retry budget is separately bounded by classifier settings.

## Stop conditions
Stop on exhausted investigation revisions, ambiguous event semantics, missing baseline, correctness regression, or verifier BLOCK. Never hide failure by dropping failed samples.

## Failure path
Restore previous policy, retain traces, document disproven hypothesis, escalate protocol/transport ambiguity.

## Verification
Known terminal states generate STOP; transient states never exceed configured attempts/wait; representative workload improves retry/latency metrics without material success/correctness regression.

## Definition of Done
Evidence documented; baseline captured; existing limitation identified; root cause classified; bounded policy implemented; tests pass; before/after metrics complete; risks documented; independent verifier PASS; no blocking issue remains.
