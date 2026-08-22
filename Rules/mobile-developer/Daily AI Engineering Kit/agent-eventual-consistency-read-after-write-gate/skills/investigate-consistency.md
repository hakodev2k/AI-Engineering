# Investigate Eventual Consistency

## Purpose
Determine whether a read-after-write failure is a true write failure, propagation delay, stale cache/replica, version conflict, or an incorrect verification target.

## When to use
Use after a write is acknowledged but a subsequent read returns missing, stale, or conflicting data.

## Inputs
- Write request/response and timestamp
- Correlation or operation ID
- Read endpoint and expected field/value
- Version/ETag/sequence when available
- Logs, traces, cache/replica topology, nearby tests

## Preconditions
Do not perform a new production write solely to reproduce the issue without approval. Work from existing evidence first.

## Allowed tools
Repository search, read-only logs/traces, API GET/HEAD, test runner, `scripts/consistency_gate.py` against approved non-destructive endpoints.

## Constraints
Separate facts from hypotheses. Do not treat an HTTP success from the write as proof that every read model is updated.

## Procedure
1. Record the acknowledged write, authoritative identifier, timestamp, expected value, and returned version.
2. Identify the read path: primary store, replica, projection, search index, CDN, application cache, or composed API.
3. Locate code that writes the entity and code that serves the read. Trace asynchronous events between them.
4. Collect evidence for each hop: outbox/event publication, consumer checkpoint, projection update, cache invalidation, replica lag.
5. Form one hypothesis per boundary and mark it `unverified`.
6. Use bounded verification with the same entity ID and correlation ID; never create repeated writes as a retry mechanism.
7. If a version exists, require observed version to be at least the write version. Otherwise require the explicit expected value.
8. Classify the failure as `propagation-delay`, `lost-event`, `stale-cache`, `replica-lag`, `read-routing`, `version-conflict`, `wrong-expectation`, or `unknown`.
9. Recommend the smallest safe remediation: wait/poll, version-aware read, cache invalidation fix, consumer recovery, routing correction, or explicit consistency contract.
10. Preserve evidence and hand off to verification.

## Expected output
A finding with classification, affected boundary, evidence, confidence, recommended action, and unresolved risks.

## Verification
The hypothesis is confirmed only when evidence links the acknowledged write to the delayed/stale hop or when the bounded gate observes the expected state/version.

## Failure handling
If logs or versions are unavailable, lower confidence and stop short of claiming a root cause. If permissions are missing, record the blocked evidence source.

## Stop conditions
Stop after the bounded retry budget, on non-retryable authorization/input errors, or before any approval-required production mutation.
