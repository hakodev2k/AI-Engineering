# Secret Reference Governance Rules

## MUST
- Treat secret names, scopes, consumers, and provisioning references as configuration contracts; validate them before merge/release when affected.
- Keep inventories value-free. Store names, metadata, fingerprints, and evidence references only.
- Bind every final review to the current repository HEAD and exact inventory fingerprint.
- Require a declared contract for every scanned secret reference that policy classifies as relevant.
- Record `source_kind`, `scope`, `required`, and expected consumers for every contract.
- Preserve unknown, conflicting, alias, and missing-source findings until resolved by evidence.
- Re-scan after any repository edit that changes secret references or config consumers.
- Require independent review for production secret-reference integrity when policy enables it.
- Require explicit human approval before creating, deleting, rotating, provider-renaming, rebinding production secrets, increasing secret-read permissions, or weakening secret protections.
- Stop when ledger/inventory/review evidence is stale, malformed, or fingerprint-mismatched.
- Use bounded retries: at most one retry for transient scanner/file/provider-metadata read failures.

## MUST NOT
- Read, print, copy, log, decode, request, or persist secret values to prove reference integrity.
- Commit real secrets, credentials, private keys, tokens, passwords, connection strings, or signed URLs.
- Assume a referenced secret exists because a workflow/build parses successfully.
- Assume a provider-side secret is safe to rename because repository consumers were updated.
- Create broad aliases or duplicate secret names just to make validation pass.
- Silently increase IAM/tool permissions to enumerate or mutate secret stores.
- Use production secret values in tests or smoke-test fixtures.
- Treat an old review as valid after HEAD, inventory fingerprint, canonical name, scope, source kind, or consumers change.
- Let the implementation owner be the sole verifier for production findings when independent review is required.
- Auto-retry validation, policy, permission, security, or business-rule failures.
- Claim `verified` when any required reference remains unknown or any blocking finding remains unresolved.

## SHOULD
- Prefer one canonical secret name per business purpose and environment boundary.
- Use `.env.example`, typed options/configuration classes, deployment manifests, and runbooks to make names discoverable without values.
- Keep provider-specific metadata adapters outside the deterministic core.
- Migrate aliases with an explicit removal condition and short lifetime.
- Add repository-specific regexes/path globs instead of weakening fail-closed defaults.
- Verify both producer/source metadata and consumer references for high-risk deployments.
- Store scan/validation/review artifacts as CI evidence when appropriate, without sensitive values.
- Separate facts, hypotheses, decisions, and open questions in investigations.
