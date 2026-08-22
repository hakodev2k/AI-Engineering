# Platform and API Product Management

## Purpose
Manage platforms and APIs as products whose customers are developers or internal teams, balancing usability, stability, governance, and ecosystem leverage.

## When to use
Use for public APIs, internal platforms, shared services, SDKs, integration ecosystems, and developer-facing capabilities.

## Inputs
Developer journeys, API contracts, usage telemetry, support issues, architecture constraints, dependency graph, SLAs/SLOs, and ecosystem goals.

## Context to inspect
Inspect authentication, versioning, quotas, documentation, SDKs, change policy, onboarding, observability, cost allocation, and dependent teams.

## Core knowledge
Platform value comes from enabling other teams or developers to deliver outcomes faster and safely. Compatibility and developer experience are product concerns, not only technical concerns.

## Procedure
1. Define platform customers and jobs to be done.
2. Map developer onboarding and integration journeys.
3. Establish product outcomes such as time-to-first-success, adoption, reliability, and reuse.
4. Prioritize capabilities that remove repeated consumer friction.
5. Define compatibility, versioning, deprecation, quota, and support policies with engineering.
6. Invest in documentation, examples, SDKs, and observability.
7. Measure usage by meaningful consumer outcomes, not raw calls alone.
8. Coordinate migrations with dependent teams.
9. Review platform economics and operational load.

## Decision points
Build platform abstractions when repeated needs and stable patterns justify shared ownership. Avoid premature platforms for one consumer or speculative reuse.

## Common failure patterns
Platform as infrastructure only, undocumented breaking changes, measuring requests instead of developer success, and forcing adoption without customer value.

## Verification
Consumers can integrate predictably, compatibility policy is enforced, adoption maps to outcomes, and operational expectations are measurable.

## Expected output
Platform strategy, developer journey, prioritized capabilities, lifecycle policies, and success metrics.

## Stop conditions
Escalate when proposed changes break critical consumers without a safe migration or when ownership and service expectations are unresolved.