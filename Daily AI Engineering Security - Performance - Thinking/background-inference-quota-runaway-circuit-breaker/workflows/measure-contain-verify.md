# Workflow — Measure, Contain, Verify

## Trigger
Unexpected background quota drain, repeated worker calls, stale-running subagents, or deployment of new autonomous background features.

## Goal
Reduce unjustified background calls while preserving legitimate progress and truthful task state.

## Inputs
Worker event traces, token/call telemetry, policy, parent/child lifecycle data, durable progress outputs.

## Baseline
Measure background calls/task, idle calls/task, same-turn repetitions, no-progress duration, token usage after terminal state, completion rate, and p95 latency.

## Context
Use `skills/diagnose-background-inference-runaway.md` and enforce `rules/background-inference-budget-rules.md`.

## Stages
1. Observe and capture an unmodified baseline.
2. Measure worker/turn state transitions and durable progress.
3. Diagnose terminal/no-input, stale-status polling, deterministic retry, or no-progress repetition.
4. Form one falsifiable hypothesis and expected metric change.
5. Implement smallest call-admission/circuit-break change.
6. Replay incident and healthy traces.
7. If not improved, re-evaluate with a changed hypothesis; maximum two retries.
8. Independent Runaway Verifier reviews evidence.

## Responsible agent
Performance investigator/implementer owns stages 1–7; Runaway Verifier owns stage 8.

## Tools
Guard script, tests, event replay, runtime logs, quota telemetry.

## Outputs
Baseline, diagnosis, hypothesis, implementation record, after metrics, blocked-call evidence, verifier verdict.

## Checkpoints
Baseline captured; root cause evidenced; pre-rollout replay; independent verification.

## Metrics
Calls/task, idle calls, same-turn count, no-progress seconds, tokens after terminal state, background quota share, false-block rate, task completion rate.

## Retry policy
Maximum two correction retries after the initial implementation. A retry MUST use new evidence and a changed hypothesis.

## Stop conditions
Success when incident trace is bounded, healthy traces pass, metrics improve, and verifier approves. Failure after bounded retries or any unacceptable false-block/task-completion regression.

## Failure path
Disable further autonomous calls for the ambiguous worker, preserve state/evidence, surface recovery need to the parent/operator, and do not mark completion.

## Verification
Tests plus incident/healthy replay and before/after usage comparison.

## Definition of Done
Implemented, Measured, Verified, and recovery behavior are all evidenced; no blocking issue remains.
