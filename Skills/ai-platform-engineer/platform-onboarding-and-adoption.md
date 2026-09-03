# Platform Onboarding and Adoption

## Purpose
Design and improve the onboarding path for product teams adopting shared AI platform capabilities, with measurable reduction in time-to-first-production-use while preserving security and operational standards.

## When to use
Use when launching platform capabilities, onboarding a new team, investigating low adoption, or replacing direct provider integrations with managed platform services.

## Inputs
- Target team use cases
- Platform capabilities and constraints
- Existing application architecture
- Security and compliance requirements
- Developer documentation and support data

## Context to inspect
Inspect onboarding tickets, duplicated integration code, time spent acquiring access, SDK setup, environment configuration, deployment requirements, support questions, bypass patterns, and reasons teams continue using direct integrations.

## Core knowledge
Internal platforms succeed when their paved road is easier than bypassing them. Adoption is an engineering signal: repeated friction often reveals missing abstractions, poor contracts, unclear ownership, or excessive policy ceremony. Senior platform engineers balance standardization with legitimate workload diversity.

## Procedure
1. Identify the team's concrete AI workload and production target.
2. Map required platform capabilities to that workload.
3. Document prerequisites such as identity, network access, budgets, and data classification.
4. Provide the smallest working integration path first.
5. Use templates or SDKs only for repetitive platform concerns.
6. Validate local, test, and production environment differences.
7. Add observability, quotas, evaluation, and policy controls before production rollout.
8. Record onboarding time and every manual handoff.
9. Classify friction as documentation, product gap, policy requirement, or team-specific complexity.
10. Remove unnecessary platform steps and automate repeatable approvals where allowed.
11. Confirm the team can operate and troubleshoot its integration without platform-team intervention for routine cases.
12. Feed recurring adoption problems into the platform roadmap.

## Decision points
Create a new paved path only when multiple workloads share the need. Use documented escape hatches for specialized cases rather than forcing a poor abstraction. Do not optimize onboarding speed by bypassing security, evaluation, or ownership requirements.

## Common failure patterns
Long access-request chains, examples that work only in one environment, undocumented provider differences, platform teams acting as permanent operators for product teams, excessive abstraction, and measuring adoption only by API call volume.

## Verification
Verify onboarding by having a representative team reach a production-ready integration using published documentation, required controls, and normal support channels. Measure time, manual interventions, failures, and residual platform-team dependencies.

## Expected output
A repeatable onboarding path with prerequisites, working examples, operational requirements, measurable adoption metrics, and a prioritized list of friction reductions.

## Stop conditions
Stop when the workload violates platform policy, required identity or data classification is unresolved, or onboarding requires unsupported platform behavior that needs an architectural decision.