# Azure Architecture Review

## Purpose
Evaluate an Azure workload across reliability, security, performance, cost, operations, and maintainability, then turn findings into prioritized engineering decisions.

## When to use
Use before major releases, after rapid growth, during modernization, following significant incidents, or when inheriting an unfamiliar Azure estate.

## Inputs
Requirements, architecture diagrams, Azure inventory, IaC, SLOs, cost data, security findings, incidents, telemetry, and operational procedures.

## Context to inspect
Inspect identity, networking, compute, data, messaging, deployment, monitoring, backup, policy, security posture, quotas, cost, dependencies, and ownership.

## Core knowledge
Architecture quality is contextual. Azure Well-Architected principles are useful lenses, but recommendations must connect to workload objectives and evidence. Improvements often trade cost, complexity, performance, and reliability against one another.

## Procedure
1. Clarify business criticality and non-functional requirements.
2. Build or validate the current architecture and dependency map.
3. Review identity and trust boundaries.
4. Review availability, scaling, quotas, and recovery.
5. Review network exposure and data protection.
6. Review performance evidence and bottlenecks.
7. Review deployment, observability, incident response, and operational ownership.
8. Review cost drivers and resource lifecycle.
9. Rank findings by risk, value, effort, and dependency.
10. Record major trade-offs and create an actionable improvement roadmap.

## Decision points
Prioritize changes that remove high-severity failure or security modes before cosmetic standardization. Accept deviations from reference architectures when workload evidence and explicit trade-offs justify them.

## Common failure patterns
Checklist-only reviews, recommending every Azure best practice regardless of context, architecture diagrams disconnected from deployed state, ignoring operational maturity, and unprioritized finding dumps.

## Verification
Validate high-priority findings against configuration/telemetry, confirm recommendations satisfy requirements, and assign measurable acceptance criteria and owners.

## Expected output
A prioritized architecture review with evidence, risks, trade-offs, recommended actions, and explicit accepted deviations.

## Stop conditions
Stop when current-state evidence is unavailable, business objectives are contradictory, or recommendations require risk/cost decisions beyond the reviewer's authority.