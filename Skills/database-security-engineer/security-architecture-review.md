# Database Security Architecture Review

## Purpose
Evaluate database designs for systemic security weaknesses before they become expensive production constraints.

## When to use
Use for new platforms, major integrations, topology changes, acquisitions, cloud migrations, or high-risk design decisions.

## Inputs
Requirements, architecture diagrams, threat model, data classification, identity design, network model, recovery objectives, and operational model.

## Context to inspect
Inspect data flows, trust boundaries, administrators, applications, replicas, backups, key management, observability, and failure modes. Validate documentation against deployable configuration where possible.

## Core knowledge
Senior review balances confidentiality, integrity, availability, operability, cost, and delivery. Security controls must survive failover, automation, maintenance, and incident response. Defense in depth is valuable only when layers address meaningful independent failure modes.

## Procedure
1. Clarify business and security objectives.
2. Identify sensitive assets and trust boundaries.
3. Review identity and privilege model.
4. Review network exposure and transport security.
5. Review encryption and key ownership.
6. Review fine-grained authorization and injection defenses.
7. Review audit, monitoring, backup, HA, and incident readiness.
8. Analyze operational workflows and privileged automation.
9. Rank findings by realistic risk.
10. Recommend minimal, maintainable controls and document trade-offs.
11. Define acceptance evidence and residual risks.

## Decision points
Prefer simpler controls with strong enforcement and ownership over complex designs that operators cannot sustain. Accept managed-service constraints when compensating controls preserve objectives.

## Common failure patterns
Diagram-only review, ignoring operations and backups, generic best-practice lists, unranked findings, and recommendations that conflict with recovery objectives.

## Verification
Trace high-risk scenarios through preventive, detective, and recovery controls and confirm owners can produce evidence.

## Expected output
A prioritized architecture review with decisions, risks, and verifiable acceptance criteria.

## Stop conditions
Escalate unresolved critical risks, missing architecture evidence, or decisions requiring formal risk acceptance.