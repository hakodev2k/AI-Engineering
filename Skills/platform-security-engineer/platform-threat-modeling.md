# Platform Threat Modeling

## Purpose
Provide a repeatable method to identify, prioritize, and reduce security risks in an internal developer platform, shared control plane, or multi-tenant engineering platform. The goal is to turn architectural knowledge into concrete security controls and engineering actions.

## When to use
Use when designing a new platform capability, changing trust boundaries, exposing a new control-plane API, onboarding a new tenant class, or reviewing a high-impact architectural change. Do not use as a substitute for implementation-level review of a specific vulnerability.

## Inputs
Architecture diagrams, data flows, identities, platform APIs, infrastructure topology, deployment model, tenant model, secrets flow, CI/CD flow, logging design, and known business/security requirements.

## Preconditions
The system scope and major actors must be identifiable. If architecture is undocumented, first reconstruct the current state from code, configuration, infrastructure, and runtime evidence.

## Context to inspect
Inspect trust boundaries, privileged services, identity providers, administrative interfaces, CI/CD systems, artifact stores, secret managers, control-plane databases, network boundaries, tenant isolation mechanisms, and recovery paths.

## Core knowledge
A platform threat model must distinguish control plane from data plane, platform operators from application teams, trusted automation from user-supplied workloads, and tenant-local impact from cross-tenant impact. High-value attack paths usually involve identity compromise, policy bypass, secret disclosure, artifact tampering, control-plane privilege escalation, or isolation failure.

## Procedure
1. Define the exact platform scope and business-critical assets.
2. Enumerate human, machine, and workload identities.
3. Map data flows and trust boundaries.
4. Identify privileged operations and irreversible actions.
5. Enumerate misuse and compromise scenarios using STRIDE or an equivalent structured method.
6. Identify attack paths that cross tenant, environment, or privilege boundaries.
7. Rate impact, exploitability, detectability, and blast radius.
8. Map existing preventive, detective, and recovery controls.
9. Identify control gaps and compensating controls.
10. Convert material risks into owned engineering actions with measurable acceptance criteria.
11. Review assumptions with platform, security, and operations stakeholders.
12. Revisit the model after architectural changes or major incidents.

## Decision points
Prefer architectural controls over repeated manual review when the same risk recurs across teams. Use defense in depth for control-plane compromise paths. Accept residual risk only when impact, likelihood, monitoring, and recovery are explicitly understood.

## Common failure patterns
Threat modeling only public endpoints, ignoring CI/CD and operator access, assuming the internal network is trusted, omitting recovery paths, treating all tenants as equally trusted, and documenting risks without owners or verification criteria.

## Verification
Verify that every major trust boundary has abuse cases, every critical asset has at least one relevant threat scenario, high-risk findings have owners, and controls can be demonstrated through configuration, tests, or operational evidence.

## Expected output
A current threat model, prioritized risk register, mapped controls, residual risks, and actionable remediation work.

## Stop conditions
Stop and escalate when scope is undefined, architecture evidence conflicts materially, a cross-tenant compromise path is discovered, or risk acceptance requires authority beyond the engineering team.