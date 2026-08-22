# Internal Developer Platform Design

## Purpose
Design a self-service platform that reduces developer cognitive load while preserving governance and operability.

## When to use
Use when teams repeatedly solve the same infrastructure, delivery, or environment problems.

## Inputs
Team workflows, service inventory, deployment architecture, constraints, SLOs, security requirements, and developer feedback.

## Context to inspect
Existing CI/CD, cloud accounts, IaC, runtime platforms, identity, observability, support burden, and common developer tickets.

## Core knowledge
A platform is a product. Prefer paved roads with escape hatches over mandatory abstractions that hide critical behavior.

## Procedure
1. Identify repeated developer pain and high-friction workflows.
2. Segment platform users and jobs-to-be-done.
3. Define platform boundaries and ownership.
4. Design self-service interfaces and golden paths.
5. Establish security, policy, observability, and lifecycle defaults.
6. Minimize required platform-specific concepts.
7. Pilot with representative teams.
8. Measure adoption, lead time, failure rate, and support load.
9. Iterate from evidence.

## Decision points
Build abstractions only where repetition and policy justify their maintenance cost. Prefer composition of proven tools over custom control planes without clear value.

## Common failure patterns
Building before discovering user needs, forcing one path on every workload, hiding operational details, weak ownership, and measuring success only by feature count.

## Verification
Verify a team can provision, deploy, observe, and recover a representative service through documented supported paths and that measurable friction decreases.

## Expected output
A platform design with users, capabilities, interfaces, boundaries, operating model, metrics, and rollout plan.

## Stop conditions
Escalate when ownership, security boundaries, funding, or target users are unresolved.