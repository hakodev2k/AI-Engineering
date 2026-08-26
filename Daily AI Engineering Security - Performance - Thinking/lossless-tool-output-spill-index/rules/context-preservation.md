# Rules: Context Preservation

- Full tool output MUST be durably preserved before any destructive truncation or compaction when later exact retrieval may affect correctness.
- `spill_threshold_bytes` MUST be lower than every upstream destructive output cap.
- Context previews MUST have a deterministic byte/token budget.
- A preview MUST include the content digest, full size, and retrieval contract when a spill exists.
- Range retrieval MUST validate the stored SHA-256 before returning data.
- The agent MUST NOT re-run a side-effectful or expensive tool solely because the original output was truncated when a valid spill exists.
- Spill storage MUST inherit the source data's access-control and sensitivity classification.
- Secrets MUST NOT be copied into logs, metrics, or test fixtures.
- Retention SHOULD be bounded to the shortest period required for verification/recovery.
- Token optimization MUST NOT remove correctness-critical context without a recoverable reference.
- Before/after claims MUST include tokens/task and task-quality or regression evidence.
