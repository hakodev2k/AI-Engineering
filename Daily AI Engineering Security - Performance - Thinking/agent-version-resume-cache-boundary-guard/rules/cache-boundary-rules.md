# Cache Boundary Rules

- A resumable session MUST persist cache-relevant identity fields before suspension.
- Resume MUST compare `runtime_version`, `model`, `effort`, system-prompt hash, tool-schema hash, hook-context hash, and policy hash before the first model call.
- Raw prompt text, credentials, tool outputs, and secrets MUST NOT be stored in the boundary manifest; store hashes or stable identifiers.
- A detected boundary mismatch MUST be labeled explicitly as structural drift; it MUST NOT be reported as TTL expiry without TTL evidence.
- Hosts SHOULD preserve the previous compatible runtime/configuration when practical, otherwise they SHOULD make the cold start explicit and measurable.
- Optimization MUST NOT remove required security policy, tool schema, or task context merely to preserve cache hits.
- A first resumed turn with abnormal cache creation MUST be measured against a pre-resume baseline before claiming regression or improvement.
- Verification MUST use an actor independent from the implementation actor when runtime behavior is changed.