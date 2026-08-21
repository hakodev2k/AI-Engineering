# Skill: Context Amplification Analysis

## Purpose
Detect when persisted history is much larger than the effective context needed by a fork.

## Trigger
Before full-history fork, after repeated compactions, after multimodal growth, or when transport retries/session size spike.

## Inputs
Rollout JSONL, configured budgets, intended fork mode, and task-required history constraints.

## Preconditions
Input is a copy/read-only source. Required context criteria are known.

## Allowed tools
Read-only file tools, hashing, JSON parsing, byte counters, token estimators when available.

## Constraints
MUST NOT mutate source history. MUST NOT remove the latest effective compaction or unique required evidence solely to save tokens.

## Procedure
1. Capture total records/bytes and largest-record baseline.
2. Count compacted records and bytes attributable to them.
3. Extract inline `data:image/...;base64` payloads and SHA-256 fingerprints.
4. Measure unique versus repeated blob bytes.
5. Estimate fork amplification for full-history inheritance.
6. Identify historical compactions that precede the latest effective compaction as optimization candidates, not automatic deletions.
7. Compare measurements with budgets.
8. Recommend allow, narrow-history, externalize-blob, or block-and-review.

## Decision points
- Any required-context uncertainty: block automated reduction.
- Amplification or record budget exceeded: reject full-history fork until reviewed.
- Repeated blobs dominate: prefer content-addressed/external references if runtime supports them.

## Expected output
Machine-readable audit plus human summary containing baseline, duplication ratios, budget violations, and safe action.

## Metrics
Persisted bytes, compacted bytes, largest record, duplicate blob bytes, unique blob bytes, amplification ratio, estimated request bytes, retries, tokens/task, quality regression rate.

## Verification
Re-run audit after optimization and compare task/context coverage against the baseline fixture.

## Failure handling
On malformed JSON, report exact line numbers and return blocking status. Maximum one parse retry after confirming encoding/newline handling.

## Stop conditions
Input corruption, unknown required context, unsupported payload type, or unresolved budget violation.