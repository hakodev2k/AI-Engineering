# Rules: Prefix Persistence Integrity

- A resumable session **MUST** persist a fingerprint/manifest of the exact cache-sensitive model-visible prefix from a known-good request.
- The persisted manifest **MUST** include runtime identity sufficient to distinguish provider, model, toolset/schema, and renderer versions.
- Resume/replay code **MUST** compare the reconstructed prefix with the known-good manifest before the first expensive model call when runtime identity is unchanged.
- Semantic equivalence **MUST NOT** be treated as cache equivalence when the provider/backend relies on exact prefix bytes/tokens.
- Required correctness, safety, authorization, and task context **MUST NOT** be removed to improve cache reuse.
- Missing/null persisted prefix state **MUST** be classified explicitly; the runtime **MUST NOT** silently rebuild and claim cache continuity.
- Segment reordering, historical replay-byte drift, or changed serialization **MUST** be observable through deterministic hashes/lengths.
- Prompt contents **MUST NOT** be written to routine diagnostic logs by this guard; hashes, lengths, segment names, and first-difference indexes are sufficient by default.
- A provider/model/toolset/renderer identity change **MUST** require explicit rebaselining unless compatibility is proven.
- Cache improvement **MUST** be measured using provider/backend evidence such as cache-read/creation tokens, input tokens, or TTFT; a code change alone is not proof.
- Quality/regression checks **MUST** confirm that no critical context was lost as part of the optimization.
- Repair loops **MUST** be bounded to three attempts and each retry **MUST** change the persistence/reconstruction hypothesis or implementation.
- The same component that implements the persistence repair **SHOULD NOT** be the only final verifier.
