# Skill: Payload Lifecycle Analysis

## Purpose
Prevent tool outputs from silently consuming session bytes/tokens or being truncated in ways that break downstream correctness.

## Trigger
Run after any tool result above the configured soft threshold, before persistence, or when projected context utilization exceeds 70%.

## Inputs
Tool name, result bytes, MIME/type, current context estimate, downstream consumers, configured limits.

## Preconditions
The raw result is available before it is appended to durable conversation history.

## Allowed tools
Token estimator, byte counter, hashing, local artifact store, metadata inspection.

## Constraints
Never discard exact data required by a declared downstream round trip. Never externalize secrets to an untrusted store. Never treat token count as a substitute for serialized request bytes.

## Procedure
1. Measure UTF-8/serialized bytes and estimated tokens.
2. Classify as `small`, `referenceable`, `exact-round-trip`, or `durable-evidence`.
3. Identify whether the same payload/hash already exists.
4. Calculate projected context utilization and request-byte utilization.
5. For referenceable payloads above threshold, persist safely and replace inline content with URI/path, SHA-256, byte count, type, and bounded preview.
6. For exact-round-trip payloads, preserve the original in an approved store and pass a reference only if the consumer can dereference it losslessly; otherwise block before unsafe truncation.
7. Evict stale inline copies only after references are verified.
8. Emit a lifecycle record for measurement.

## Decision points
- If projected hard-limit utilization >= 90%, block retention and invoke recovery.
- If payload contains secrets, use an approved encrypted/local store or block externalization.
- If no lossless downstream reference mechanism exists for exact-round-trip data, stop and escalate.

## Expected output
A JSON lifecycle decision containing class, original bytes/tokens, retained bytes/tokens, hash, storage reference, reason, and blocking status.

## Metrics
Inline bytes avoided, tokens avoided, deduplication ratio, context utilization, recovery events, correctness regressions.

## Verification
Re-hash dereferenced content and compare to original for exact-round-trip payloads. Confirm retained preview plus metadata stays below budget.

## Failure handling
Retry storage once. On second failure, keep the original outside model history if possible and stop the agent before dispatching an oversized request.

## Stop conditions
Stop after two failed storage/reference attempts, any hash mismatch, or inability to preserve required exact data.