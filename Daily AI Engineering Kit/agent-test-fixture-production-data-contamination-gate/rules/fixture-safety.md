# Fixture Safety Rules

## MUST

- Treat operational payloads, logs, database rows, HAR files, support exports, screenshots, and incident artifacts as sensitive until provenance is established.
- Record each affected fixture as `synthetic`, `generated`, `unknown`, or `production-derived` before completion.
- Replace production-derived values with deterministic synthetic values that preserve only behaviorally required shape, length, type, ordering, encoding, and edge-case semantics.
- Run `scripts/scan-fixtures.py` after fixture changes and before verification.
- Preserve scan output, test output, and changed-file evidence in the final evidence contract.
- Require an independent verifier when a blocking finding was remediated.
- Stop before any action requiring production access or broader permissions.

## MUST NOT

- Do not copy new production records, credentials, customer payloads, access tokens, cookies, connection strings, or private keys into the repository.
- Do not test whether a suspected credential is valid.
- Do not hide a finding by encoding, hashing, truncating, encrypting, or moving the same sensitive value to another tracked file.
- Do not broaden allowlists to silence a specific unexplained finding.
- Do not modify public API contracts, database schemas, production configuration, security controls, or Git history without explicit human approval.
- Do not claim a heuristic email/IP match is confirmed production data without corroborating evidence.
- Do not use real customer identifiers when synthetic identifiers can reproduce the behavior.

## SHOULD

- Prefer `example.com`, `.test`, `.invalid`, localhost, RFC documentation IP ranges, deterministic UUIDs, and clearly fake account numbers.
- Keep synthetic generators close to tests when many fixtures share the same shape.
- Minimize snapshots and cassettes to fields actually asserted by tests.
- Redact or discard operational evidence after deriving the minimal reproduction when repository policy permits.
- Add a regression test for every confirmed contamination path that could recur.