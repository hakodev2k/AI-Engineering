# Architecture Review

## Purpose
Assess whether a customer architecture is supportable, resilient, secure, scalable, and aligned with documented product capabilities.

## When to use
Use before go-live, major expansion, migration, repeated incidents, or significant topology change.

## Inputs
Architecture diagrams, traffic profiles, integrations, data flows, SLOs, security requirements, deployment configuration, and known constraints.

## Context to inspect
Failure domains, dependencies, redundancy, capacity, authentication, network boundaries, data paths, observability, recovery mechanisms, and unsupported configurations.

## Core knowledge
A TAM architecture review is advisory and evidence-based. It should identify material risk without pretending to own the customer’s architecture decisions.

## Procedure
1. Confirm business-critical workloads and nonfunctional requirements.
2. Trace request, data, and control paths end to end.
3. Identify single points of failure and shared failure domains.
4. Review capacity, scaling, resilience, security, and recovery assumptions.
5. Compare configuration against supported patterns and current guidance.
6. Rank findings by likelihood, impact, and remediation effort.
7. Separate mandatory corrections from optional optimization.
8. Record decisions and residual risk with accountable owners.

## Decision points
Recommend redesign when risk is structural; recommend configuration change when architecture is sound but implementation is weak.

## Common failure patterns
Reviewing diagrams without runtime evidence, overfocusing on best practices, ignoring customer constraints, and presenting preferences as requirements.

## Verification
Validate high-risk findings against documentation, telemetry, tests, or specialist review and confirm owners accept remediation or residual risk.

## Expected output
A prioritized architecture review with findings, evidence, recommendations, and accepted risks.

## Stop conditions
Stop when architecture details are materially incomplete, access is insufficient, or a security-critical change requires specialist approval.