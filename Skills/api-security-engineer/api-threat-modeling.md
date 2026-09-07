# API Threat Modeling

## Purpose
Provide a repeatable method for identifying, prioritizing, and documenting threats against APIs before implementation or major change. This matters because authorization gaps, trust-boundary mistakes, data exposure, and abuse paths are cheaper to remove during design than after production release.

## When to use
Use for new APIs, material endpoint changes, new trust boundaries, third-party integrations, privileged operations, authentication redesigns, or sensitive data exposure. Do not use as a substitute for implementation review or penetration testing.

## Inputs
- API requirements and consumers
- Architecture and data-flow diagrams
- Authentication and authorization model
- Endpoint contracts and schemas
- Data classification
- Deployment and network topology
- Existing incidents or abuse cases

## Preconditions
Understand business purpose, actors, protected assets, expected trust assumptions, and operational environment.

## Context to inspect
Inspect ingress paths, identity providers, gateways, service-to-service calls, data stores, queues, webhooks, admin paths, tenant boundaries, and externally controlled fields.

## Core knowledge
Use threat modeling around assets, actors, entry points, trust boundaries, attacker goals, and mitigations. Consider STRIDE when useful, but prioritize API-specific risks such as broken object-level authorization, broken function-level authorization, mass assignment, SSRF, replay, credential abuse, excessive data exposure, resource exhaustion, and business-flow abuse.

## Procedure
1. Define protected assets and security objectives.
2. Enumerate legitimate actors, identities, and privilege levels.
3. Map request flows across trust boundaries.
4. List externally controllable inputs and reachable operations.
5. Identify authentication, authorization, confidentiality, integrity, availability, and abuse threats.
6. Trace object-level and function-level access decisions.
7. Evaluate tenant isolation and indirect-reference risks.
8. Identify replay, automation, enumeration, and rate-abuse scenarios.
9. Rank threats by impact, exploitability, exposure, and detectability.
10. Define preventive, detective, and recovery controls.
11. Assign verification evidence for each high-risk mitigation.
12. Record accepted residual risks and required approvals.

## Decision points
Prefer design-level elimination over compensating controls when feasible. Use coarse gateway controls for broad protections, but keep resource-level authorization close to business objects. Require stronger identity, step-up verification, or human approval when impact justifies added friction.

## Common failure patterns
- Modeling infrastructure but ignoring business abuse
- Treating authentication as authorization
- Missing tenant-boundary threats
- Assuming identifiers are secret
- Ignoring asynchronous callbacks and webhooks
- Ranking every threat equally
- Creating mitigations with no verification plan

## Verification
Confirm every high-risk threat maps to an implemented or explicitly accepted control. Review authorization matrices, negative tests, rate limits, logging, and recovery paths. Re-run the model after major architecture changes.

## Expected output
A concise threat model containing assets, actors, trust boundaries, prioritized threats, required controls, verification evidence, and residual-risk decisions.

## Stop conditions
Stop and escalate when critical architecture details are unknown, security ownership is unclear, a high-impact threat has no feasible mitigation, or residual risk requires formal approval.