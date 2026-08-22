# Skill — Safe Read-Only Result Deduplication

## Purpose
Remove repeated unchanged read-only payloads from model context while preserving correctness.

## Trigger
A read-only tool returns a payload and a prior result exists for the same canonical resource identity.

## Inputs
Tool name, canonical arguments, resource identity, raw result, previous digest/result metadata, optional ETag/version/mtime, policy.

## Preconditions
The tool MUST be classified read-only. Resource identity MUST be deterministic. If the underlying resource can change, at least one freshness signal MUST be available before suppressing bytes.

## Required context
Previous ledger entry, current task requirements, and whether exact bytes are required for verification.

## Allowed tools
Read-only filesystem/repository/API metadata calls, deterministic hashing, token/byte counters.

## Constraints
Never deduplicate side-effecting results. Never infer freshness from elapsed time alone. Never replace changed content with an unchanged reference. Never remove evidence required by tests or security review.

## Procedure
1. Classify tool as eligible, ineligible, or conditionally eligible.
2. Canonicalize the resource identity independently from incidental arguments.
3. Normalize only representation noise explicitly allowed by policy; do not normalize semantic content.
4. Compute SHA-256 over normalized bytes.
5. Validate freshness using ETag/version/mtime/content digest as appropriate.
6. If current and previous digests match and freshness is established, emit an unchanged-reference envelope containing resource identity, digest, prior reference, byte count avoided, and freshness evidence.
7. Otherwise emit the full result and update the ledger.
8. Record the decision for token and regression analysis.

## Decision points
- Unknown resource identity -> bypass.
- Side-effecting/volatile tool -> full result.
- Digest equal but freshness unverifiable -> full result.
- Digest changed -> full result and invalidate prior reference.
- Exact content requested -> full result.

## Expected output
A deterministic decision record plus either full payload or compact unchanged reference.

## Metrics
Bytes avoided, estimated tokens avoided, eligible hit rate, false-dedup count, compaction count, task quality.

## Verification
Replay unchanged, changed, ambiguous, volatile, and exact-byte-required fixtures. False deduplication MUST remain zero.

## Failure handling
On parser/hash/metadata errors, bypass optimization and return the full result. Log the reason without logging secrets.

## Stop conditions
Stop optimizing when correctness cannot be established, policy forbids caching, or regression tests fail.