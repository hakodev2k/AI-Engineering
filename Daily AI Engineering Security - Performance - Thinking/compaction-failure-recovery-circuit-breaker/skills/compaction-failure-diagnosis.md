# Skill: Compaction Failure Diagnosis

## Purpose
Turn compaction/recovery telemetry into an evidence-backed decision without requesting hidden reasoning.

## Trigger
Compaction failure, context overflow, repeated summary attempt, headless termination near compaction, or provider/host threshold mismatch.

## Inputs
Normalized event JSONL, recovery policy, runtime/model identifiers, optional before/after context metrics.

## Preconditions
Telemetry timestamps/order are reliable enough to reconstruct lifecycle. Vendor-specific events are normalized without deleting failure events.

## Required context
Configured model/window, host compaction policy, provider-native compaction behavior when known, and whether a durable checkpoint exists.

## Allowed tools
Read logs, deterministic parser, runtime docs/issues, benchmark/replay fixtures.

## Constraints
MUST NOT infer success from activity alone. MUST NOT retry indefinitely. MUST NOT expose or request chain-of-thought. MUST preserve failure evidence.

## Procedure
1. Identify the first compaction start in the affected sequence.
2. Classify terminal outcome: success, failure, session end, or incomplete.
3. Count consecutive failures since last success/meaningful progress.
4. Check whether a checkpoint was saved before a repeated recovery attempt.
5. Compare `retry_debris_tokens` across failures when telemetry exposes it.
6. If failure count or debris-growth threshold is exceeded, open circuit.
7. If a session ends after start/failure without success/progress, classify potential premature termination and require recovery review.
8. Form a bounded recovery hypothesis: fresh context + checkpoint handoff, smaller bounded summary input, corrected context-window mapping, or vendor fix.
9. Re-run once under controlled conditions; verify observable progress before closing circuit.

## Decision points
- Repeated failure with no checkpoint: block.
- Consecutive failures >= policy maximum: block.
- Debris growth > threshold: block.
- Success/progress resets failure sequence.
- Incomplete telemetry: do not claim verified recovery.

## Expected output
Facts, evidence, failure shape, circuit decision, recovery requirement, verification status.

## Metrics
Retry count, checkpoint coverage, debris growth, false terminal count, recovery success.

## Verification
Replay deterministic fixtures and one real incident trace when available.

## Failure handling
Invalid telemetry exits 3. Circuit-open condition exits 2. Preserve original log.

## Stop conditions
Stop automatic recovery when the circuit opens or after one controlled recovery attempt fails to show measurable progress.