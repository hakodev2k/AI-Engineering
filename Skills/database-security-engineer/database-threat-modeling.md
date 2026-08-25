# Database Threat Modeling

## Purpose
Identify database-specific attack paths and convert them into prioritized controls before implementation or major change.

## When to use
Use for new data stores, exposed interfaces, trust-boundary changes, sensitive-data features, or security reviews.

## Inputs
Architecture diagrams, data flows, identities, schemas, network paths, classifications, deployment model, and threat assumptions.

## Context to inspect
Confirm database engine, hosting model, consumers, administrative paths, replication, backups, extensions, and existing controls. Do not assume topology from documentation alone.

## Core knowledge
Model assets, actors, entry points, trust boundaries, abuse cases, privilege escalation, data exfiltration, tampering, denial of service, and recovery. Risk depends on likelihood, impact, detectability, and control strength.

## Procedure
1. Define assets and security objectives.
2. Map data flows and trust boundaries.
3. Enumerate human, workload, and service identities.
4. Identify attack surfaces and privileged operations.
5. Develop credible abuse cases.
6. Rank risks using the organization's method.
7. Map preventive, detective, and recovery controls.
8. Record residual risk and owners.
9. Add verification evidence and review triggers.

## Decision points
Prefer architectural elimination over compensating controls when practical. Accept residual risk only with explicit ownership and rationale.

## Common failure patterns
Ignoring backup paths, assuming private networks are trusted, missing service identities, treating encryption as complete protection, or producing threats without actionable mitigations.

## Verification
Trace every high-risk threat to a control, test, owner, and residual-risk decision. Validate diagrams against deployed configuration.

## Expected output
A current database threat model with prioritized mitigations and evidence requirements.

## Stop conditions
Escalate when critical architecture is unknown, required evidence is inaccessible, or risk acceptance requires security or business approval.