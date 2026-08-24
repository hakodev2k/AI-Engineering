# Rules: Cross-Surface Convergence Contract

- A resumed write-capable agent MUST compare its surface snapshot with canonical state before continuing.
- A matching `session_id` MUST NOT be treated as proof of freshness.
- `canonical_version` and `last_durable_turn` MUST NOT lag the authority for a continuing writer.
- A `selected_child_id` mismatch MUST block continuation unless a human explicitly selects the older branch.
- Different unexpired writer identities MUST be treated as a conflict.
- A remote surface MUST validate `registration_epoch` when bridge registration is required.
- Recovery MUST NOT overwrite newer canonical state merely to make a stale client usable.
- Reconciliation retries MUST be bounded to two.
- The implementing surface MUST NOT be the only verifier.
- Unknown decision-critical fields SHOULD fail closed for writes.
- Logs MUST NOT contain transcript bodies, secrets, or raw tool outputs when metadata is sufficient.