# Skill — Progress Loop Analysis

## Purpose
Detect repeated agent actions that produce no new evidence or state and terminate them before the outer turn limit is exhausted.

## Trigger
Any tool-using agent run that has retries, validation failures, repeated calls, or a hard turn limit.

## Inputs
Ordered step events containing tool, arguments, status, error class, result digest, state fingerprint, and whether new evidence was produced.

## Preconditions
Events are captured after each tool step and do not contain secrets in plaintext.

## Procedure
1. Establish a baseline from known stuck and productive runs.
2. Canonicalize JSON arguments and tool names.
3. Hash action signatures and result/error signatures.
4. Mark a step as progress only when it changes state, evidence, hypothesis, or recovery path.
5. Count repeated action signatures, repeated error signatures, and consecutive no-progress steps.
6. Exempt only explicitly classified transient failures and cap those retries separately.
7. Return `continue`, `recover`, or `terminate` with evidence.
8. Re-run the baseline and compare calls, tokens, latency, and false positives.

## Decision points
- Repeated equivalent call beyond limit: terminate.
- Repeated same non-transient error beyond limit: recover or terminate.
- Transient error within retry allowance: continue.
- No-progress streak beyond limit: terminate.
- New evidence/state: reset no-progress streak.

## Expected output
Machine-readable decision, signature, counters, and evidence window.

## Metrics
Tool/model calls per stuck run, time-to-stop, no-progress steps, false-positive termination rate, and successful recovery rate.

## Verification
Run the deterministic fixture suite and verify productive fixtures never terminate early.

## Failure handling
If event semantics are incomplete, fall back to the hard global step cap and flag the run as unverified rather than guessing progress.

## Stop conditions
One decision per completed step. Overall analysis stops at termination, completion, or `max_total_steps`.
