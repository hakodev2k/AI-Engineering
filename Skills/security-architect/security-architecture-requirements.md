# Security Architecture Requirements

## Purpose
Translate business, technical, regulatory, and threat requirements into explicit security architecture constraints and acceptance criteria.

## When to use
Use during new system design, major change, acquisition integration, cloud migration, or security review. Do not use as a substitute for detailed product requirements or legal interpretation.

## Inputs
Business goals, architecture diagrams, data classifications, compliance obligations, threat context, reliability targets, identity model, deployment constraints.

## Preconditions
Stakeholders and system boundaries are identifiable; major data flows and trust relationships are at least partially known.

## Context to inspect
Existing security standards, prior incidents, inherited controls, shared platforms, identity providers, network zones, third-party dependencies, and operational ownership.

## Core knowledge
Security requirements must be testable, risk-linked, proportionate, and traceable to assets and threats. Control statements that cannot be verified are weak architecture requirements.

## Procedure
1. Define system scope, assets, users, and trust boundaries.
2. Classify sensitive data and critical operations.
3. Identify legal, contractual, and internal policy obligations.
4. Derive requirements for identity, access, encryption, isolation, logging, recovery, secrets, and supply chain.
5. Separate mandatory controls from risk-based recommendations.
6. Add measurable acceptance criteria for each requirement.
7. Map requirements to owners and lifecycle stages.
8. Resolve conflicts with performance, usability, cost, and reliability goals.
9. Record assumptions and residual risks.

## Decision points
Prefer preventive controls for high-impact abuse paths, detective controls when prevention is impractical, and compensating controls only when risk remains acceptable.

## Common failure patterns
Generic checklists, unclear ownership, requirements disconnected from threats, untestable wording, and missing operational constraints.

## Verification
Confirm each critical asset and trust boundary has corresponding requirements and that every requirement has a validation method.

## Expected output
A prioritized, traceable security requirement set with acceptance criteria and ownership.

## Stop conditions
Stop and escalate when system scope is undefined, regulatory interpretation is disputed, or critical data flows cannot be identified.