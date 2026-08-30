# Security Architecture Review

## Purpose
Evaluate security implications of major technical designs and ensure trust boundaries, identity, data protection, abuse resistance, and operational controls are appropriate to risk.

## When to use
Use for new trust boundaries, sensitive data flows, external integrations, privileged workflows, authentication changes, or high-impact platform designs.

## Inputs
Architecture proposal, data-flow diagrams, threat model, identity model, data classification, deployment topology, compliance constraints.

## Preconditions
System boundaries and assets are sufficiently defined for threat analysis.

## Context to inspect
Authentication and authorization paths, secret handling, encryption, network boundaries, logging, administrative access, dependencies, tenant isolation, and incident response requirements.

## Core knowledge
Security architecture is risk-based. Least privilege, defense in depth, secure defaults, explicit trust boundaries, auditable control planes, and blast-radius reduction matter more than adding controls mechanically.

## Procedure
1. Identify assets, actors, and trust boundaries.
2. Trace sensitive data and privileged operations.
3. Enumerate realistic threat scenarios.
4. Evaluate identity, authorization, isolation, and secret management.
5. Review input boundaries and external dependencies.
6. Assess logging, detection, response, and recovery capabilities.
7. Rank findings by exploitability and impact.
8. Recommend controls proportionate to risk.
9. Record accepted residual risks and accountable approvers.

## Decision points
Prefer architectural risk reduction over compensating controls when feasible. Escalate material residual risk rather than silently accepting it.

## Common failure patterns
Checklist-only reviews, conflating authentication with authorization, weak tenant isolation, sensitive logging, shared credentials, implicit trust, and unowned residual risk.

## Verification
Confirm identified controls are implemented and tested, privilege boundaries behave as intended, and residual risks have explicit owners.

## Expected output
A security review with threat scenarios, findings, required mitigations, residual risks, and verification evidence.

## Stop conditions
Stop and involve security specialists when cryptographic design, regulated data, severe abuse scenarios, or organizational risk acceptance exceed available expertise or authority.