# Checkpoint Conformance Rules

- Production resume MUST use only saver backend/version combinations with a current conformance verdict for all required invariants.
- Applications MUST declare which checkpoint invariants their routing, replay, recovery, and audit logic depends on.
- Saver validation MUST include metadata round-trip, latest selection, history/parent completeness, and ordering behavior when those capabilities are used.
- Sync and async implementations SHOULD be tested against identical fixtures and MUST agree on declared semantic invariants.
- A backend MUST NOT be considered equivalent merely because it implements the same interface.
- Missing nested metadata, changed cursor ordering, skipped parents, or different latest-selection results MUST be treated as reasoning-integrity failures.
- Conformance failures MUST block automatic resume when the failed invariant is required for correctness.
- Retry loops MUST be bounded to two remediation cycles and MUST NOT weaken expected invariants to obtain a pass.
- Verification evidence MUST record backend name, backend version, fixture-set hash, profile version, and observed results.
- The implementing agent MUST NOT be the only verifier for persistence changes affecting resume semantics.
