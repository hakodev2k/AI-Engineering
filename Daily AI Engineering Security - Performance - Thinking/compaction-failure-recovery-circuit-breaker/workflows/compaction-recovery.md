# Workflow: Compaction Recovery

## Trigger
Compaction failure, context overflow, repeated compaction, headless end near compaction, or hard-exhausted subagent.

## Goal
Recover without unbounded retries, false completion, or avoidable state loss.

## Inputs
Incident telemetry, recovery policy, checkpoint/memory state, task completion criteria.

## Baseline
Measure compaction starts/successes/failures, context tokens, retry-debris tokens if available, checkpoint coverage, and session termination outcome.

## Context
Use observable events only; do not require hidden chain-of-thought.

## Stages
1. **Observe** — freeze and preserve the incident trace.
2. **Measure baseline** — compute failures, retries, checkpoint state, prompt pressure/debris.
3. **Diagnose** — classify oversized summary, threshold mismatch, lifecycle termination, or hard exhaustion.
4. **Form hypothesis** — choose one changed strategy with expected measurable effect.
5. **Implement improvement** — attach circuit breaker and, if needed, checkpoint/handoff adapter.
6. **Measure again** — replay trace plus controlled recovery once.
7. **Improved?** If no observable progress, stop automatic retry and escalate. Maximum controlled recovery attempts: 1 after circuit trip.
8. **Verify** — independent Recovery Verifier confirms task completion evidence and no regression.

## Responsible agent
Runtime implementer; independent verifier from `subagents/recovery-verifier.md`.

## Tools
`compaction_guard.py`, log adapters, runtime checkpoint APIs, test harness.

## Outputs
Circuit decision, recovery plan, before/after metrics, verification record.

## Checkpoints
Before destructive recovery; after circuit decision; after fresh-session handoff; before reporting completion.

## Metrics
Failure count, retry count, debris growth, checkpoint coverage, successful post-recovery turn, final task verification.

## Retry policy
At most the configured consecutive failure threshold; after circuit trip, one materially changed recovery attempt. No identical autonomous retries.

## Stop conditions
Circuit open; no checkpoint when required; one changed recovery attempt fails; telemetry invalid; task state cannot be safely reconstructed.

## Failure path
Pause, preserve evidence, create an explicit handoff from last durable checkpoint, and escalate.

## Verification
Success requires both guard status safe and independent evidence that the original task reached its Definition of Done.

## Definition of Done
Failure loop bounded, checkpoint/state protected, recovery measured, and completion independently verified.