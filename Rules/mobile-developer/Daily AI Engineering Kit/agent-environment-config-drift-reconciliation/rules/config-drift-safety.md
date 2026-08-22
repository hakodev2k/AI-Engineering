# Config Drift Safety Rules

## MUST
- Treat configuration snapshots as read-only evidence during investigation.
- Redact secret-like values; reports may contain only key names and fingerprints.
- Record evidence for every high-risk finding.
- Distinguish intentional environment differences from unexplained drift.
- Require explicit human approval before production config, secret, auth, TLS, database connection, schema, infrastructure, or security-control changes.
- Rerun drift detection after any approved reconciliation.
- Preserve failed command output when verification fails.
- Keep retries bounded to `max_reconcile_attempts` from `config/drift-policy.json`.

## MUST NOT
- Do not print, commit, summarize, or transmit raw secret values.
- Do not modify production configuration automatically.
- Do not weaken authentication, authorization, encryption, TLS, rate limits, or audit controls to remove a finding.
- Do not silently add permissions when a source cannot be read.
- Do not classify drift as safe solely because tests pass.
- Do not overwrite environment-specific values without evidence that they should match the baseline.
- Do not retry indefinitely.

## SHOULD
- Prefer reconciling configuration through the repository or declared source of truth.
- Prefer immutable snapshots and audit records as evidence.
- Verify behavior with focused tests or runtime probes after reconciliation.
- Keep production-specific exceptions explicit and documented in policy rather than hidden in agent instructions.
