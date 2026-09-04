# Rules: Multimodal Payload Budgets

- Runtime code MUST assign a stable content hash to heavyweight inline payloads before child inheritance or compaction serialization.
- A runtime MUST NOT treat provider prompt caching as proof that replay cost is negligible.
- Every child context MUST have a measurable inherited-inline-byte budget.
- Duplicate payloads SHOULD be represented by immutable references when the consumer can safely rehydrate them.
- A reference MUST preserve artifact identity, media type, integrity hash, and authorized retrieval boundary.
- The system MUST NOT remove visual/media context required for correctness solely to reduce tokens.
- Rehydration MUST be explicit and counted as another artifact access; repeated rehydration above budget MUST block or require operator-approved override.
- Unknown-lineage heavyweight payloads MUST fail closed when `fail_closed_on_missing_lineage` is enabled.
- Compaction MUST NOT serialize duplicate binary payload bytes when an integrity-preserving reference can represent the same artifact.
- Benchmark claims MUST include baseline and after measurements for bytes, tokens, storage, and at least one quality/acceptance metric.
- A change MUST NOT be marked Verified if replay decreases only because required artifacts were omitted.
- Automated remediation loops MUST stop after two unsuccessful optimization iterations and surface the remaining causal evidence.
