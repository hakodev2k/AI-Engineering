# Skill: Progress Ledger Analysis

## Purpose
Determine whether an agent retry is justified by new evidence or merely repeats a failed/no-progress state.

## Trigger
Repeated tool errors, watchdog interruption, automatic continuation, subagent restart, or any retry consuming material tokens/time.

## Inputs
Attempt ledger, normalized retry key, failure signature, tool/file/test events, token usage, checkpoint identifiers.

## Preconditions
Events are timestamped or attempt-scoped and distinguish model text from external state changes.

## Required context
Task goal, current acceptance criteria, latest checkpoint, relevant tool result and failure signature.

## Allowed tools
Read-only logs, filesystem/test state inspection, `scripts/progress_circuit_breaker.py`, unit tests.

## Constraints
- MUST NOT count filler text, repeated plans, or "continuing" messages as progress.
- MUST treat externally observable changes as stronger evidence than model claims.
- MUST normalize retries by operation plus material arguments/state version.
- MUST NOT retry a deterministic identical failure past policy without a causal input change or explicit human approval.

## Procedure
1. Build a retry key from operation, normalized arguments, target resource, and relevant state version.
2. Record the failure signature and resource cost for each attempt.
3. Classify events as qualifying progress (`file_change`, `test_state_change`, `checkpoint`, `new_evidence`, `tool_result_changed`) or non-progress.
4. Run the deterministic circuit breaker.
5. If blocked, require a changed hypothesis, changed causal input, checkpoint resume, or explicit approval before another attempt.
6. If allowed, capture the expected evidence that would prove the retry was useful.
7. After retry, update the ledger and verify external state.

## Decision points
Retry only when the next attempt is materially different or resumes from a useful checkpoint. Stop when identical failures, no-progress streak, or token budget exceed policy.

## Expected output
Facts, Evidence, Assumptions, Retry decision, Changed input, Expected progress signal, Verification status.

## Metrics
No-progress attempt count, identical-failure count, tokens per retry key, checkpoint reuse rate, retries/task, successful recovery rate.

## Verification
Independent verifier confirms claimed progress from repository/test/tool state rather than assistant text alone.

## Failure handling
Detection: circuit breaker block. Evidence: ledger plus state snapshot. Retry policy: maximum two no-progress attempts by default. Fallback: stop and preserve checkpoint. Escalation: ambiguous destructive operation or repeated infrastructure fault. Stop condition: deterministic budget exceeded or no causal change available.
