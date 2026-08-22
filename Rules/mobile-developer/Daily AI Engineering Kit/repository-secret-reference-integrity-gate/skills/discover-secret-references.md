# Skill: Discover Secret References

## Purpose
Build a repository-local inventory of secret *names and references* without retrieving or exposing secret values.

## When to use
Use before changing CI/CD, deployment configuration, environment-variable usage, secret names, provider bindings, or code that reads credentials. Also use when a build/deploy fails because a secret reference may be missing or renamed.

## Inputs
- Repository root and current HEAD.
- `config/secret-reference-policy.json`.
- Existing secret contract declarations, runbooks, deployment docs, CI variable definitions, or platform configuration metadata that expose names only.
- Optional base/head diff when the trigger is a change review.

## Preconditions
- Repository can be read.
- The task does not require reading secret values.
- Any provider query is restricted to metadata/name/existence where the platform permits it safely.

## Required context
Start narrowly: repository structure, CI/deployment files, environment access points, nearby configuration code, and affected tests. Expand only when a discovered reference requires more context.

## Allowed tools
- Read/search repository files.
- Git read-only commands.
- `scripts/scan-secret-references.py`.
- Provider/CI metadata APIs that return secret names or binding metadata without values, when already authorized.

## Forbidden actions
- Reading, printing, copying, logging, decoding, or requesting secret values.
- Creating, rotating, deleting, renaming, or changing access to secrets.
- Increasing permissions to enumerate secrets.
- Treating a repository reference as proof that the provider-side secret exists.

## Procedure
1. Capture repository HEAD and trigger scope.
2. Identify likely consumers: workflows, deployment manifests, application configuration readers, scripts, infrastructure bindings, `.env.example`, and package-specific config.
3. Run `scripts/scan-secret-references.py` with the repository policy.
4. Deduplicate discovered references by `(name,path,line,pattern_id)`.
5. For each discovered name, locate a declared contract or create a proposed contract record using evidence already available.
6. Record `source_kind`, `scope`, `required`, expected consumers, aliases, and provisioning-reference metadata. Do not store values.
7. Mark aliases only when there is evidence that an old name intentionally maps to the canonical name. A similar-looking name is not an alias by assumption.
8. Separate facts from hypotheses. Example: `PAYMENTS_API_KEY is referenced at workflow line 31` is a fact; `the GitHub secret probably exists` is a hypothesis until metadata proves it.
9. Validate the inventory with `scripts/validate-secret-inventory.py`.
10. Preserve unknown references, conflicts, and missing source information as findings; do not hide them by weakening policy.

## Expected output
- Inventory artifact containing repository/head, canonical contracts, and reference locations.
- Inventory fingerprint.
- Findings for unknown references, aliases, stale declarations, and unresolved producer/source metadata.

## Verification
- No secret value appears in the inventory.
- Every scanned reference has file/line/pattern evidence.
- Every required contract has a non-`unknown` source kind before a verified outcome.
- Inventory fingerprint is reproducible for the exact artifact.

## Failure handling
- Scanner/config error: preserve stderr and retry once only for transient filesystem/tool failure.
- Unreadable file: record the limitation; do not claim complete coverage if the unreadable file is in scope.
- Permission failure for provider metadata: stop that metadata lookup; do not escalate privileges automatically.
- Unknown reference: keep it unresolved and let validation fail closed according to policy.

## Stop conditions
Stop and escalate when secret values would be required, source metadata cannot be safely accessed, a dangerous secret-management action is requested, or the repository evidence is insufficient to classify a production reference.
