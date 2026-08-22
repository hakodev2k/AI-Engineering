# Architecture Governance

## Purpose
Enable coherent technical decisions across teams without turning architecture into centralized approval bureaucracy.

## When to use
Use for cross-cutting architecture decisions, standards, high-impact technology choices, platform boundaries, or recurring inconsistency that creates operational cost.

## Inputs
Architecture principles, system landscape, ADRs, technology inventory, security requirements, operational data, and team ownership.

## Context to inspect
Inspect existing decisions, real failure modes, team autonomy, coupling, lifecycle costs, and whether a proposed standard solves a repeated problem.

## Core knowledge
Governance should constrain only where coordination, risk, or long-term cost requires it. Decision records, paved roads, automated checks, and consultation scale better than approval committees.

## Procedure
1. Identify the class of decisions needing coordination.
2. Gather evidence of inconsistency cost or risk.
3. Define principles and minimum constraints.
4. Assign decision rights to the lowest competent level.
5. Require ADRs for consequential or difficult-to-reverse choices.
6. Provide supported defaults and reference implementations.
7. Automate enforceable controls where practical.
8. Create exception paths with explicit rationale and review dates.
9. Measure adoption, friction, and outcomes.
10. Remove standards that no longer provide value.

## Decision points
Standardize where interoperability, security, operability, or skill concentration matters. Allow diversity when experimentation value exceeds coordination cost.

## Common failure patterns
Architecture review boards for routine decisions, standards without tooling, permanent exceptions, technology bans without evidence, and governance disconnected from production outcomes.

## Verification
Verify decision rights are clear, standards have rationale and support, exceptions are traceable, and governance reduces rather than merely relocates friction.

## Expected output
A lightweight governance model with principles, decision rights, standards, ADR expectations, automation, and exception handling.

## Stop conditions
Escalate when decisions create enterprise-wide security, regulatory, contractual, or financial exposure beyond delegated authority.