# Fork Budget Rules

- Every full-history or inherited-history fork MUST measure inherited bytes and estimated tokens before creation when history exceeds the configured preflight threshold.
- The latest effective compacted state and required post-compaction suffix MUST be preserved.
- Superseded historical compaction snapshots MUST NOT be treated as simultaneously required model-visible context unless a verified semantic requirement exists.
- Repeated large binary/data-URL payloads SHOULD use content-addressed references when the runtime supports safe resolution.
- Canonical parent history MUST NOT be destructively rewritten merely to reduce child token/storage cost.
- Security instructions, permission state, approvals, task constraints, and unresolved decisions MUST NOT be removed solely for token savings.
- A fork MUST be blocked or narrowed when the inherited payload exceeds its byte/token budget and safe reduction cannot be proven.
- Retrying a request after an oversized-history failure MUST NOT resend an unchanged pathological payload more than once.
- Optimization MUST compare baseline and optimized quality/coverage before rollout.
- Reports MUST record bytes/tokens by record class and duplicate/superseded contribution without persisting sensitive payload contents.
- Automated optimization retries MUST be bounded to two.
- Human approval MUST be required before any repair that mutates canonical persisted history.