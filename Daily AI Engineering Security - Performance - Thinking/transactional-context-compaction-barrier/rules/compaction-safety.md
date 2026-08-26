# Rules: Compaction Safety

- A compaction trigger MUST use a token counter explicitly scoped to the **current materialized context**.
- Cumulative request, session, billing, or run usage MUST NOT be treated as current-context size.
- Source history MUST be durably checkpointed before a compacted replacement can be committed.
- Side-effecting tool calls MUST be terminal (`committed` or `failed_confirmed`) before compaction commits.
- An `issued`, `unknown`, or missing side-effect state MUST block compaction.
- The original transcript MUST remain recoverable until the compacted candidate passes verification.
- Compaction retries for an unchanged history digest MUST be bounded by policy.
- A compacted candidate MUST reduce measured current-context tokens by the configured minimum ratio.
- A failed reduction MUST NOT be hidden by lowering the required context, correctness, durability, or verification standard.
- Compaction logs MUST include token scope, history digest, blocker/retry reason, and before/after counts, but MUST NOT include secrets.
- Dangerous or irreversible recovery actions MUST require explicit human approval.
