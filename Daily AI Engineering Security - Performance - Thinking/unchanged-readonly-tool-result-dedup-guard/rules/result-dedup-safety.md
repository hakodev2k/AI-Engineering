# Rules — Read-Only Result Dedup Safety

- Eligible tool classifications MUST be explicit and reviewable.
- Side-effecting tools MUST NOT use result suppression.
- A repeated tool name and arguments MUST NOT by themselves prove that the resource is unchanged.
- Resource identity MUST be canonical and stable before a prior result can be referenced.
- Changed ETag, version, mtime, digest, or equivalent freshness evidence MUST invalidate the previous result reference.
- Unknown freshness SHOULD cause a full result to be emitted.
- Exact-byte, forensic, security, and regression-verification tasks MUST receive full content when required for correctness.
- Normalization MUST NOT remove semantic differences.
- The dedup ledger MUST store hashes/metadata rather than secrets when raw content retention is unnecessary.
- The runtime MUST record whether each result was `full`, `unchanged_reference`, or `bypass`.
- Token savings MUST be measured against a baseline workload; estimated savings MUST be labeled as estimates.
- Quality and correctness regressions MUST block rollout even if token usage improves.
- False deduplication MUST be treated as a correctness defect, not an acceptable optimization trade-off.
- Rollout SHOULD begin in observe-only mode before suppression is enabled.
- Failure of the dedup mechanism MUST fail open to the full tool result, not fail closed by hiding context.