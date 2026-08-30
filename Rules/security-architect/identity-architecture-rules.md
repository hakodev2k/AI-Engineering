# Identity Architecture Rules

## Purpose
Ensure identity is a deliberate security control plane rather than an application convenience.

## Scope
Human, workload, service, machine, administrative, and federated identities.

## MUST
- Identity architecture MUST define authoritative identity sources, lifecycle, authentication strength, federation boundaries, and failure behavior.
- Privileged identities MUST be separated from routine identities and protected with stronger assurance.
- Workloads MUST use unique, non-human identities where supported.
- Identity lifecycle MUST cover provisioning, changes, revocation, recovery, and stale-account detection.
- Authentication assurance MUST be proportional to transaction and privilege risk.

## MUST NOT
- MUST NOT share persistent service credentials across unrelated workloads.
- MUST NOT depend on identifiers that can be reassigned as durable authorization principals without safeguards.
- MUST NOT design recovery paths weaker than the primary authentication path for high-impact accounts.

## SHOULD
- Prefer short-lived, automatically rotated credentials and phishing-resistant authentication for privileged access.

## Exceptions
Require documented constraints, compensating controls, residual risk, and approval.

## Verification
Inspect identity flows, federation configuration, lifecycle controls, credential age, privileged-access design, and authentication tests.