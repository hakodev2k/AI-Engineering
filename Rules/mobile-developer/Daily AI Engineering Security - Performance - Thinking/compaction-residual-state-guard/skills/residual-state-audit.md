# Skill: Residual State Audit

## Purpose
Ensure context compaction removes token-heavy content without losing state required to continue the task correctly.

## Trigger
Before compaction, after oversized tool output, before session resume/fork, or when required execution state has been truncated.

## Inputs
Tool-call/result inventory, persisted references, required-state markers, hashes, sizes, active goal, next planned actions.

## Preconditions
Persisted data locations are known for recoverable records. Secrets are not copied into residual metadata.

## Required context
Active goal plus only execution facts that may be needed after compaction.

## Allowed tools
Read session/rollout metadata, hash local persisted records, run `scripts/residual_guard.py`, and read recovery references.

## Constraints
Do not retain content solely because it exists. Do not remove correctness-critical state merely to reduce tokens. Residuals must not contain secrets or full sensitive payloads when a secure reference is sufficient.

## Procedure
1. Inventory stateful tool calls/results since the previous checkpoint.
2. Mark each item `required=true` only when future execution/verification depends on it.
3. For oversized required state, create a durable reference and SHA-256 hash; record retained/omitted byte counts.
4. Mark whether the referenced state is actually recoverable by the continuation environment.
5. Run `scripts/residual_guard.py manifest.json --policy config/residual-policy.json --strict`.
6. If blocked, either preserve the required state inline, create a valid recovery path, or stop compaction.
7. Compact only after residual coverage is complete.
8. After compaction, resolve a sample of required references and verify hashes before proceeding.

## Decision points
- Required + omitted + no valid recovery reference => block.
- Required + reference + invalid/missing hash => block.
- Non-required state may be evicted according to token budget.
- Sensitive content should remain out of model context when a secure reference can preserve correctness.

## Expected output
Residual coverage report, required-state references, token/byte reduction estimate, and compaction allow/block decision.

## Metrics
Required residual coverage, omitted bytes, recovery success, repeated-work rate, post-compaction context size, verification regressions.

## Verification
Recovery Verifier independently resolves required references and validates hashes on representative fixtures.

## Failure handling
Maximum two repair attempts. If required state cannot be represented safely and recoverably, stop compaction and escalate.

## Stop conditions
Compaction is allowed with complete residual coverage, or blocked because required state is unrecoverable/unsafe to expose.
