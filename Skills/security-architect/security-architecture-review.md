# Security Architecture Review

## Purpose
Perform a structured review of a proposed or existing system to identify material security design risks before implementation or release.

## When to use
Use for major features, new platforms, cloud migrations, high-risk integrations, and periodic reviews of critical systems.

## Inputs
Architecture diagrams, data flows, requirements, threat model, deployment topology, identity design, control standards, test evidence.

## Preconditions
The review scope, owner, and decision timeline are defined.

## Context to inspect
Trust boundaries, privileged operations, external interfaces, data stores, shared services, dependencies, recovery paths, observability, and exceptions.

## Core knowledge
Architecture review should evaluate whether controls address real risks, not merely whether checklist items exist. Findings must distinguish design defects, implementation defects, and accepted residual risk.

## Procedure
1. Confirm scope, critical assets, and business impact.
2. Walk system and data flows with the owning team.
3. Review threat assumptions and high-risk abuse cases.
4. Evaluate identity, network, data, cryptography, logging, recovery, and supply-chain controls.
5. Identify trust assumptions that lack enforcement.
6. Rank findings by exploitability and impact.
7. Propose practical remediation options and trade-offs.
8. Assign owners and acceptance criteria.
9. Record residual risk and required approvals.
10. Re-review material design changes.

## Decision points
Block release only for risks above defined acceptance thresholds or where required controls are absent. Avoid requiring expensive controls for low-impact threats without justification.

## Common failure patterns
Checklist-only reviews, late review after architecture is fixed, vague findings, no risk ranking, and recommendations that ignore operability.

## Verification
Confirm each critical finding has evidence, owner, disposition, and verification method; validate resolved findings before closure.

## Expected output
A prioritized review record with risks, remediation options, decisions, and residual-risk ownership.

## Stop conditions
Stop when the architecture is too incomplete to assess, critical stakeholders are unavailable, or risk acceptance exceeds reviewer authority.