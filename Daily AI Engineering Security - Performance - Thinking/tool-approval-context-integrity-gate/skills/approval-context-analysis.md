# Skill: Approval Context Integrity Analysis

## Purpose
Determine whether a human/policy approval is bound to the exact executable leaf tool call.

## Trigger
Any approval-bearing call, delegated action, resume-after-approval path, serializer change, or approval UI change.

## Inputs
Tool-call ID, leaf tool, parsed arguments, delegation chain, consequence class, consequence summary, destination, approval fingerprint.

## Preconditions
The runtime can identify the actual leaf action before execution.

## Required context
Only observable approval/execution metadata; hidden chain-of-thought is neither needed nor requested.

## Allowed tools
Read-only logs/config, unit tests, `scripts/approval_guard.py`.

## Constraints
MUST fail closed when arguments are missing/unparseable, the leaf tool is hidden, or the execution fingerprint differs from approval.

## Procedure
1. Capture the approval request and execution event separately.
2. Normalize the exact leaf tool and parsed argument object.
3. Record delegation chain, destination, and consequence class.
4. Run the guard in `request` mode to produce a fingerprint.
5. Bind the approval decision to that fingerprint.
6. Before execution run `execute` mode against the actual call.
7. Compare blocked reasons with protocol/UI evidence.
8. Require an independent reviewer for high-risk paths.

## Decision points
Block on missing fields, unknown consequence, high-risk action without consequence/destination, or fingerprint mismatch.

## Expected output
Facts, Evidence, approval fingerprint, allow/block decision, Risks, Verification status.

## Metrics
Envelope completeness, mismatch blocks, high-risk context coverage, regression-pass rate.

## Verification
Re-run unit tests and a mutation fixture where one argument changes after approval.

## Failure handling
Preserve the attempted envelope, redact secrets, deny execution, and escalate the integrity-loss reason.

## Stop conditions
Maximum two diagnosis iterations. Stop immediately on an irreversible action with ambiguous approval context.
