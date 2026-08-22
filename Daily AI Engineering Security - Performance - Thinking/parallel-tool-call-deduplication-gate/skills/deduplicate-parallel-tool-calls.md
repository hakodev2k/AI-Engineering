# Skill: Deduplicate Parallel Tool Calls

## Purpose
Remove redundant equivalent tool calls before execution while preserving intentional repeated operations.

## Trigger
A model turn produces two or more tool calls, or telemetry shows duplicate calls per logical action.

## Inputs
Validated call list, `config/policy.json`, tool schemas, observed baseline traces.

## Preconditions
Tool-call streaming must be finalized; malformed/partial calls must be rejected before this skill. Tool authorization must already be known.

## Required context
Tool side-effect semantics, whether an idempotency/uniqueness field exists, and baseline call counts.

## Allowed tools
Read schemas/config, run deterministic script/tests, inspect traces. No production writes during diagnosis.

## Constraints
Do not sort arrays unless the schema explicitly marks them order-insensitive. Do not deduplicate unknown side-effecting tools automatically. Do not bypass authorization or HITL.

## Procedure
1. Capture at least 20 representative turns or all turns if sample is smaller.
2. Count tool calls and manually label known duplicate logical operations.
3. Classify each tool: `collapse` for deterministic/idempotent duplicate calls; `allow` where repeated equal calls are valid; `review` for side effects or unknown semantics.
4. Canonicalize object keys recursively while preserving array order and scalar types.
5. Compute SHA-256 of `{name,args}`.
6. Group calls by signature.
7. For `collapse`, retain first and record later duplicates.
8. For `allow`, retain all.
9. For `review`, if duplicates exist, block that duplicate group and require policy/approval rather than guessing.
10. Run fixture tests and replay captured traces in dry-run.
11. Measure call-count and latency deltas.

## Decision points
- Partial call? Reject, do not dedupe.
- Unknown tool? Review.
- Same signature but explicit user-generated unique operation IDs differ? They will not share a signature; retain both.
- Duplicate group exceeds configured maximum? Block and investigate model/streaming failure.

## Expected output
Decision report containing retained, collapsed and review-required IDs plus baseline/after metrics.

## Metrics
Duplicate execution ratio, calls/logical operation, p95 tool-stage latency, false-collapse rate.

## Verification
Independent verifier reviews all review-required groups and a sample of collapsed groups. Tests must prove dictionary-order normalization and array-order preservation.

## Failure handling
If canonicalization fails, block the affected group. One policy correction retry is allowed; a second ambiguity escalates to a human/tool owner.

## Stop conditions
Stop when all calls are classified, tests pass, dry-run shows zero false collapses, and measurable duplicate reduction is demonstrated; otherwise do not enable enforcement.
