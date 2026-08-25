# Key Generation and Provisioning

## Purpose
Generate and introduce cryptographic keys into systems without exposing or weakening them.

## When to use
Use for service onboarding, device manufacturing, PKI enrollment, tenant key creation, HSM/KMS adoption, and key replacement.

## Inputs
Key purpose, algorithm, ownership model, trust boundary, target storage, provisioning channel, and compliance requirements.

## Context to inspect
Generation environment, entropy source, HSM/KMS capabilities, identities, transport path, audit controls, backup policy, and activation workflow.

## Core knowledge
Keys should be generated as close as practical to their protected execution boundary. Private or symmetric keys should not be exported unless the design explicitly requires controlled export. Provisioning must authenticate both source and destination.

## Procedure
1. Define key purpose, owner, scope, and cryptoperiod.
2. Choose approved algorithm and parameters.
3. Select generation boundary: application, KMS, HSM, secure element, or offline ceremony.
4. Validate entropy and generation controls.
5. Establish authenticated provisioning identities and channels.
6. Minimize plaintext key exposure and transient copies.
7. Bind metadata: identifier, version, purpose, status, creation time, and policy.
8. Activate only after destination verification.
9. Record auditable evidence without logging secret material.
10. Test rollback and failed-provisioning cleanup.

## Decision points
Prefer non-exportable keys for high-value signing and root trust. Use envelope or wrapped transport when keys must cross boundaries. Split knowledge or dual control is appropriate for high-impact root material, not every application key.

## Common failure patterns
Generating keys on developer laptops; emailing key files; logging secrets; ambiguous ownership; missing key IDs; weak provisioning authentication; leaving failed copies behind.

## Verification
Confirm key attributes and non-exportability where required, inspect audit records, test target use, and prove no secret appears in logs or artifacts.

## Expected output
A repeatable generation/provisioning procedure with ownership, controls, metadata, audit evidence, and recovery behavior.

## Stop conditions
Stop if trusted generation, authenticated provisioning, required custody controls, or secure destination storage are unavailable.