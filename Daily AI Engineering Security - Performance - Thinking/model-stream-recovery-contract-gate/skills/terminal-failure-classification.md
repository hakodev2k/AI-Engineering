# Skill: Terminal Failure Classification

## Purpose
Classify a failed agent turn from observable runtime evidence so recovery is based on cause rather than misleading terminal text.

## Trigger
Stream stall, provider/API error, watchdog timeout, cancellation, subagent interruption, or failure-hook invocation.

## Inputs
Ordered runtime events with sequence number, event type, cause, actor, retryability and correlation identifiers.

## Preconditions
Events belong to one run/turn and clocks/order are trustworthy enough to reconstruct sequence.

## Required context
Configured recovery hook, retry budget, side-effect policy and whether an explicit human cancellation signal was received.

## Allowed tools
Trace validator, runtime logs/transcripts, transport error metadata and hook logs.

## Constraints
Do not infer user intent from a generic cancellation exception. Do not request hidden chain-of-thought. Do not retry state-changing operations without independent idempotency evidence.

## Procedure
1. Identify the first causal failure event.
2. Record its source: provider, transport, watchdog, runtime, user or unknown.
3. Check for an explicit human cancellation event and actor.
4. Compare terminal classification to causal evidence.
5. Determine whether policy marks the cause recoverable.
6. Verify the configured recovery hook actually started and ended.
7. Count retries and confirm budget.
8. Verify exactly one final terminal event.
9. Produce Facts, Evidence, Classification, Recovery status, Risks and Verification status.

## Decision points
An explicit actor=`user` cancellation takes precedence and forbids auto-recovery. Machine timeout/stall evidence without human cancel MUST NOT become `user_cancelled`. Missing evidence becomes `unknown_failure`.

## Expected output
Evidence-backed terminal classification plus recovery eligibility.

## Metrics
Classification coverage, false-user-cancel count, hook coverage and retry violations.

## Verification
Run deterministic fixtures plus a live canary when changing runtime code.

## Failure handling
Ambiguous causal evidence => unknown/fail closed. Corrupt sequence => invalid trace. Conflicting terminal events => blocking violation.

## Stop conditions
Explicit user cancellation, retry budget exhausted, unsafe side-effect replay risk, or three unsuccessful remediation hypotheses.
