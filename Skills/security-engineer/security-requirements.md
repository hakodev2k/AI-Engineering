# Security Requirements Engineering

## Purpose
Translate business risk, data sensitivity, architecture, and compliance obligations into concrete, testable security requirements.

## When to use
Use during new-system design, major feature work, security reviews, platform migrations, and remediation planning.

## Inputs
Business requirements, data classification, user roles, threat model, compliance obligations, architecture, incident history, third-party dependencies.

## Preconditions
System scope and key stakeholders must be identifiable. Legal or regulatory interpretations must come from authorized sources.

## Context to inspect
Authentication, authorization, trust boundaries, sensitive data flows, privileged operations, audit needs, recovery objectives, external integrations, deployment model.

## Core knowledge
Security requirements should be specific, risk-driven, measurable, and mapped to threats or obligations. Separate policy intent from implementation mechanism so controls can evolve without losing the requirement.

## Procedure
1. Identify critical assets and business-impacting abuse cases.
2. Map actors, privileges, data classifications, and trust boundaries.
3. Extract mandatory obligations from approved policies and standards.
4. Convert risks into explicit preventive, detective, and recovery requirements.
5. Define measurable acceptance criteria for each requirement.
6. Assign ownership and implementation boundaries.
7. Resolve conflicts with usability, availability, latency, and cost.
8. Trace requirements to designs, tests, monitoring, and incident procedures.
9. Review residual risks with accountable owners.

## Decision points
Prefer requirements based on outcomes, such as 'privileged actions require independently verifiable authorization', over technology-specific mandates unless the technology itself is required.

## Common failure patterns
Generic statements like 'system must be secure', copying control catalogs without context, missing ownership, no verification method, and treating compliance as equivalent to risk reduction.

## Verification
Each high-risk threat or obligation maps to at least one testable requirement, with implementation evidence and a defined verification method.

## Expected output
A prioritized security requirement set with rationale, acceptance criteria, traceability, owners, and approved residual risks.

## Stop conditions
Escalate when legal interpretation, risk acceptance authority, data classification, or system scope is unresolved.