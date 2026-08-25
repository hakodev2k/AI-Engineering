# Threat Modeling

## Purpose
Identify credible abuse paths before implementation or release, prioritize security work by risk, and document assumptions that future reviewers can challenge.

## When to use
Use for new trust boundaries, sensitive workflows, major architecture changes, exposed APIs, authentication changes, or material data-flow changes. Do not use as a substitute for testing or incident analysis.

## Inputs
Architecture diagrams, requirements, data classifications, identities, deployment topology, integrations, existing controls, and known constraints.

## Context to inspect
Inspect actual data flows, entry points, privilege transitions, secrets, external dependencies, administrative paths, and production deployment differences. Confirm assumptions with code and configuration where possible.

## Core knowledge
Threat modeling is risk analysis, not a checklist. Assets, actors, trust boundaries, attack preconditions, impact, likelihood, detectability, and compensating controls matter. STRIDE, attack trees, and abuse cases are techniques, not goals.

## Procedure
1. Define scope, business objective, and security-sensitive assets.
2. Diagram components, identities, data stores, protocols, and trust boundaries.
3. Enumerate entry points and privileged operations.
4. Generate abuse cases for spoofing, tampering, disclosure, denial, privilege escalation, and workflow abuse.
5. Trace each credible threat to preconditions and affected assets.
6. Record existing preventive, detective, and recovery controls.
7. Rank residual risk using the organization's risk model.
8. Propose the smallest effective mitigations and assign owners.
9. Identify verification evidence for each mitigation.
10. Revisit the model after material design changes.

## Decision points
Prefer architectural elimination over downstream detection when cost is reasonable. Accept risk only with explicit ownership and expiry/review criteria. Avoid controls whose operational cost exceeds the credible risk without justification.

## Common failure patterns
Modeling only infrastructure, ignoring business-logic abuse, assuming internal networks are trusted, listing theoretical threats without preconditions, and closing risks without verification.

## Verification
Verify diagrams against implementation, confirm every high-risk threat has disposition, and test representative mitigations. Implemented means a control exists; verified means evidence shows it blocks or detects the modeled abuse.

## Expected output
A scoped threat model with data flows, ranked threats, mitigations, owners, residual risks, and verification evidence.

## Stop conditions
Escalate when asset classification is unknown, architecture is materially incomplete, risk acceptance authority is required, or a critical threat cannot be mitigated safely.