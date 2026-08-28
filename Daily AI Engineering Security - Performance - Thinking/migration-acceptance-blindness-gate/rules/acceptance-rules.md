# Rules: Migration Acceptance

- A repository migration MUST have explicit structural acceptance invariants before implementation.
- Behavioral tests MUST NOT be treated as proof that the migration occurred.
- Expected new technology markers MUST be enumerated and verified.
- Forbidden legacy markers MUST be enumerated and checked after implementation.
- Compatibility shims MUST NOT be accepted when the migration contract requires full removal of the legacy implementation.
- The implementation agent MUST NOT be the only verifier.
- Behavioral regression tests MUST pass at the configured threshold.
- Verification evidence MUST be stored before acceptance.
- Repair loops MUST be bounded to the configured maximum.
- A failed gate MUST block completion rather than weakening migration scope or test requirements.
