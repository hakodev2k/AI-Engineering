# Secret Inventory and Classification

## Purpose
Establish an authoritative inventory of secrets and classify them by sensitivity, lifetime, ownership, and blast radius so controls can be prioritized rationally.

## When to use
Use during secrets-program onboarding, audits, migrations, breach response, or when unmanaged credentials are suspected.

## Inputs
- Repositories and deployment manifests
- Secret-store metadata
- CI/CD configuration
- Cloud and identity inventories
- Ownership information

## Context to inspect
Inspect application configuration, pipeline variables, certificates, API tokens, database credentials, service accounts, signing keys, and historical storage patterns. Avoid exposing secret values during discovery.

## Core knowledge
An inventory should capture metadata rather than plaintext: owner, consumer, producer, environment, store, type, rotation capability, expiry, privilege, and dependency. Classification should reflect consequence of disclosure and operational replaceability.

## Procedure
1. Define the scope and secret taxonomy.
2. Enumerate known stores and workload configuration sources.
3. Run approved secret-detection methods without collecting plaintext unnecessarily.
4. Correlate discovered material with applications, identities, and owners.
5. Deduplicate aliases and replicated copies.
6. Classify sensitivity, privilege, lifetime, external exposure, and blast radius.
7. Identify unknown owners, expired material, and unmanaged locations.
8. Rank remediation by risk and exploitability.
9. Store inventory metadata in an access-controlled system.
10. Establish recurring reconciliation against infrastructure and repositories.

## Decision points
Treat high-privilege, externally usable, non-expiring credentials as highest priority. Prefer metadata fingerprints for correlation when plaintext comparison would increase exposure.

## Common failure patterns
- Copying discovered secrets into tickets or spreadsheets
- Assuming all tokens have equal risk
- Ignoring certificates and signing material
- Inventorying stores but not consumers
- Leaving orphaned credentials active

## Verification
Sample inventory entries against actual stores and consumers; confirm owners, expiry, and privilege. Verify no secret values are persisted in the inventory output.

## Expected output
A reconciled metadata inventory with classification, ownership, gaps, and prioritized remediation actions.

## Stop conditions
Stop if discovery requires unapproved access, could expose production plaintext broadly, or legal/security policy restricts scanning scope.