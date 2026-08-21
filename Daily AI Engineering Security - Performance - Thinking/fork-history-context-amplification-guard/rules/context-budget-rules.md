# Context Budget Rules

- A full-history fork MUST have a measured preflight before inheritance when persisted history exceeds configured thresholds.
- The preflight MUST record total bytes, compacted bytes, largest record, inline-blob bytes, duplicate-blob bytes, and compaction count.
- The system MUST NOT discard the latest effective compacted history or unique task-required context merely to reduce size.
- Historical compaction snapshots MUST NOT be treated as simultaneously required without evidence that each remains semantically active.
- Identical inline blobs SHOULD be referenced once when the runtime supports content-addressed storage.
- A fork MUST be blocked when any hard byte/record budget is exceeded unless a human explicitly approves the risk.
- Retry logic MUST NOT resend an unchanged over-budget payload indefinitely; at most one unchanged transport retry is allowed before diagnosis.
- Optimization MUST preserve required-context coverage and MUST compare before/after quality fixtures.
- Budget configuration MUST be explicit and version-controlled; hidden limits MUST NOT be invented.
- Measurements MUST distinguish persisted bytes from model-visible/effective context.