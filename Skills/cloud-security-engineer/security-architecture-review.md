# Cloud Security Architecture Review

## Purpose
Evaluate proposed cloud architecture for security risk, control sufficiency, and operational feasibility before costly implementation.

## When to use
Use for new systems, major migrations, sensitive integrations, or material changes in trust boundaries.

## Inputs
Requirements, architecture, data classification, threat model, NFRs, identity/network/data designs, and operational model.

## Context to inspect
Inspect existing platform standards, deployed analogues, IaC patterns, incident history, regulatory constraints, and ownership boundaries.

## Core knowledge
Review security as a system property: identity, data, network, supply chain, observability, resilience, and recovery interact. Recommendations need risk rationale and operational owners.

## Procedure
1. Confirm business function and security objectives.
2. Identify critical assets and trust boundaries.
3. Review identity and privilege model.
4. Review exposure and network paths.
5. Review data lifecycle and key management.
6. Review build/deployment trust.
7. Review logging, detection, backup, and recovery.
8. Analyze failure and abuse scenarios.
9. Rank findings by risk and implementation timing.
10. Record decisions, exceptions, and owners.

## Decision points
Block design only for risks above accepted tolerance or missing foundational controls; otherwise provide prioritized improvements with trade-offs.

## Common failure patterns
Checklist reviews, late security involvement, architecture assumptions not validated, unrealistic controls, and findings with no priority.

## Verification
Re-review changed design and implementation evidence for critical controls before production approval.

## Expected output
Actionable architecture findings, accepted risks, control requirements, and verification criteria.

## Stop conditions
Escalate when critical requirements are missing, risk acceptance authority is unclear, or proposed controls cannot meet mandatory obligations.