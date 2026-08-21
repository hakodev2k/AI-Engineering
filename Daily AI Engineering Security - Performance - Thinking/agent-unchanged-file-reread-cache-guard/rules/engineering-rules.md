# Engineering Rules

## MUST
- MUST establish a duplicate-read baseline before claiming token or latency improvement.
- MUST canonicalize paths before cache lookup.
- MUST bind cache hits to a content fingerprint, not path alone.
- MUST represent partial reads as explicit ranges and only hit when the requested range is covered.
- MUST invalidate or re-fingerprint after write, edit, move, delete, checkout, merge, external change, or other repository mutation that may affect content.
- MUST distinguish `content unchanged` from `exact text still resident in model context`.
- MUST downgrade context residency to unknown after compaction unless the host can prove preservation.
- MUST perform a real read when exact content is required and residency is unknown.
- MUST fail open to a real read when cache integrity cannot be proven.
- MUST record cache hit/miss/invalidation/rehydration metrics without storing secret file contents in the ledger.
- MUST verify zero stale-content substitutions in regression tests before broad rollout.

## MUST NOT
- MUST NOT suppress a first read.
- MUST NOT infer unchanged content from filename, timestamp, or size alone when correctness is at risk.
- MUST NOT cache secrets or full file bodies merely to implement deduplication; fingerprints and range metadata are sufficient.
- MUST NOT treat a compacted summary as proof that exact source text remains available.
- MUST NOT use unlimited retry/read loops.
- MUST NOT optimize away explicit user-requested rereads or independent verification reads.
- MUST NOT report token savings without measured before/after evidence.

## SHOULD
- SHOULD use SHA-256 or another collision-resistant fingerprint.
- SHOULD use metadata as a cheap prefilter and hash when metadata changed or identity must be proven.
- SHOULD share the ledger across trusted subagents working in the same workspace/session generation.
- SHOULD scope ledgers by repository/worktree and task to avoid cross-context contamination.
- SHOULD return a compact machine-readable unchanged receipt rather than silently returning nothing.
- SHOULD preserve read fingerprints across compaction while downgrading context residency.
- SHOULD cap hashing cost for very large files and prefer range fingerprints or repository object IDs where reliable.
- SHOULD expose a forced-read reason field for auditability.
- SHOULD compare quality/error rates alongside token and latency metrics.
