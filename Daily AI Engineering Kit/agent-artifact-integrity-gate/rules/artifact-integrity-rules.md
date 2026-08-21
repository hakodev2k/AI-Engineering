# Artifact Integrity Rules

## MUST
- Every persisted intermediate artifact consumed by another agent or resumed later must have an integrity record.
- Every integrity record must include artifact ID, path, SHA-256, task ID, repository ID, producer, producer status, creation time, expiry time, and artifact type.
- Consumers must verify current bytes against the stored SHA-256 before semantic use.
- Expired artifacts must be regenerated or explicitly reverified; timestamps must not be edited to bypass expiry.
- Derived artifacts must list source artifact IDs when those sources materially affect the output.
- High-trust stages such as implementation, production decisions, security decisions, migrations, and release gates must consume only independently verified artifacts.
- Hash mismatch, task mismatch, repository mismatch, missing lineage, or producer status `failed`/`blocked` must block consumption.
- Any manual override of a blocking gate must require explicit human approval and a recorded reason.

## MUST NOT
- Do not treat file existence as proof of integrity.
- Do not allow the producer to be the only verifier for high-trust artifacts.
- Do not silently replace an artifact while retaining the old hash record.
- Do not promote `registered` to `verified` without an independent verification step.
- Do not reuse an artifact from another task merely because the content looks relevant.
- Do not ignore stale source artifacts when validating a derived artifact.
- Do not store secrets in integrity records.
- Do not modify or delete source artifacts during verification.

## SHOULD
- Bind records to repository commit/ref when practical.
- Prefer short TTLs for volatile artifacts such as test results, environment snapshots, external research, and generated plans.
- Keep artifact IDs stable within one artifact version and create a new ID for materially changed bytes.
- Record verification evidence and verifier identity.
- Run ledger validation before commit and before workflow completion.