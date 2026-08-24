# Skill — Deliverable Acceptance

## Purpose
Convert a child-agent terminal event into an evidence-backed acceptance decision instead of trusting lifecycle labels.

## Trigger
Run immediately after a delegated agent/task reaches any terminal or apparently terminal state and before its output is used.

## Inputs
- Child state JSON compatible with `scripts/validate_terminal_state.py`.
- Deliverable contract: required files, minimum bytes, required text/JSON fields, optional verification commands.
- Tool-call ledger when available.
- Parent task acceptance criteria.

## Preconditions
The child must no longer be actively producing events, or the snapshot must explicitly be marked provisional.

## Required context
Only the task contract, child terminal metadata, relevant tool events, and declared deliverables. Do not load unrelated conversation history.

## Allowed tools
Read-only transcript/artifact inspection, deterministic validation scripts, non-destructive test/verification commands.

## Constraints
Do not infer hidden reasoning. Do not execute deferred side effects merely to make the child complete. Do not retry until side-effect safety is established.

## Procedure
1. Record the raw lifecycle status and terminal reason.
2. Reconcile each result-required tool call with one matching tool result.
3. Check explicit failure/deferred/limit/timeout signals.
4. Validate every required deliverable: existence, size, required fields/markers, and configured verifier.
5. Check whether the final child output satisfies the requested result type rather than merely describing future work.
6. Classify:
   - `accepted`: all mandatory evidence passes;
   - `incomplete`: recoverable missing result/deliverable with no proven task failure;
   - `failed`: explicit terminal failure or failed verification;
   - `needs_review`: ambiguous/unknown state or unsafe retry.
7. For `incomplete`, construct a residual task containing only missing work and preserved evidence.
8. Permit at most two automated recovery attempts. After that, stop and escalate.
9. Require an independent verifier for high-impact recovered results.

## Decision points
- Unmatched tool call? `incomplete` unless explicit terminal error makes it `failed`.
- Deferred side-effecting tool? `needs_review`; do not replay automatically.
- Required file exists but is below minimum bytes or misses marker? `incomplete` or `failed` according to verifier semantics.
- Terminal status says success but terminal reason is non-natural? terminal reason wins.

## Expected output
A normalized acceptance record containing decision, reasons, evidence references, missing requirements, retry safety, and next action.

## Metrics
Acceptance false-positive rate, incomplete-detection rate, retry count, recovered-work reuse, verification coverage, wasted rerun tokens.

## Verification
Use the fixtures in `tests/test_terminal_state_validator.py`; additionally sample real child transcripts and manually review false accepts/rejects.

## Failure handling
If input JSON is malformed, classify as `needs_review`. If a verifier command cannot run, do not accept the corresponding deliverable.

## Stop conditions
Stop when accepted and independently verified where required; when a non-retryable failure is proven; when retry safety is unknown; or after two recovery attempts.