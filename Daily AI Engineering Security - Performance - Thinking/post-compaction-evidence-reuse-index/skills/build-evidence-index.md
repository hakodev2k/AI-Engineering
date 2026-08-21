# Skill — Build and Use a Post-Compaction Evidence Index

## Purpose
Preserve cheap, verifiable references to previously inspected artifacts so an agent can avoid redundant re-reads/re-runs after compaction without trusting stale summaries.

## Trigger
Before re-reading a large file, re-running an expensive command/test, or reconstructing evidence after compaction/resume.

## Inputs
Index path, target file or normalized command, current file content/state fingerprint, optional exact-result artifact path, and task evidence requirements.

## Preconditions
The source of truth must still be available. Reuse is allowed only when freshness can be checked deterministically.

## Allowed tools
Hashing, filesystem metadata, Git revision/state queries, package index script, and read-only inspection of referenced artifacts.

## Constraints
- MUST NOT reuse an entry when freshness cannot be proven.
- MUST NOT treat a command string alone as proof that its prior result is still valid.
- MUST preserve correctness-critical context even when token savings would be larger without it.
- MUST keep exact large outputs outside active prompt until actually needed.

## Procedure
1. Establish baseline: count repeated reads/runs, compactions, bytes/tokens, latency.
2. On first observation, register file hash or command result + state fingerprint.
3. Store exact large command output in an external artifact and index its path/hash.
4. After compaction, query the index before fetching/running again.
5. For files, recompute SHA-256; only a matching hash is fresh.
6. For commands, recompute/receive the caller-defined state fingerprint; only an exact match is reusable.
7. Return compact metadata first. Load exact artifact only if the current decision requires it.
8. Record hit/miss/stale and resulting tokens/latency.

## Decision points
- Hash/fingerprint match → reuse reference.
- Mismatch → refresh source and replace entry.
- Missing artifact or unverifiable state → refresh.
- Correctness-critical evidence requiring exact current output → refresh even if metadata matches when the fingerprint is insufficient.

## Expected output
Fresh/stale decision with source key, hash/fingerprint, observed timestamp, artifact reference, and reason.

## Metrics
Duplicate reads/runs, index hit rate, stale rejection rate, tokens/task, compactions/hour, latency, correctness regressions.

## Verification
Compare baseline against indexed runs on the same workload. A token reduction is accepted only with no stale-hit correctness failures.

## Failure handling
Index corruption or unknown schema → ignore index and refresh from source. Never guess freshness.

## Stop conditions
Required evidence is fresh and available; freshness cannot be established; or measured savings fail to justify complexity after two evaluation cycles.
