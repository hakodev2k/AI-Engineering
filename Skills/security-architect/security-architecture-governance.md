# Security Architecture Governance

## Purpose
Establish lightweight governance that keeps security architecture standards current, enforceable, risk-based, and aligned with engineering delivery.

## When to use
Use when security architecture spans multiple teams, platforms, business units, or technology domains and requires consistent decision-making over time.

## Inputs
Security policies, reference architectures, review workflows, exception records, engineering lifecycle, incident lessons, platform roadmaps, risk thresholds.

## Preconditions
Architecture owners, engineering stakeholders, and risk authorities are identifiable.

## Context to inspect
Existing design-review processes, standards, approval bottlenecks, exception volumes, recurring findings, delivery metrics, control automation, and ownership gaps.

## Core knowledge
Governance should reduce systemic risk without becoming a manual gate for every change. High-value controls should be automated or platform-enforced where practical, while human review focuses on novel or high-impact decisions.

## Procedure
1. Define which architecture changes require formal security review.
2. Establish risk-based review tiers and decision authority.
3. Maintain reference patterns for recurring designs.
4. Convert stable requirements into automated guardrails where feasible.
5. Define exception, escalation, and residual-risk processes.
6. Track recurring findings and systemic control gaps.
7. Measure review cycle time, adoption, exception age, and control effectiveness.
8. Feed incidents and technology changes back into standards.
9. Retire obsolete requirements and patterns deliberately.
10. Communicate decisions and rationale to engineering stakeholders.

## Decision points
Automate controls when requirements are stable and machine-verifiable. Reserve senior architectural review for ambiguous trust boundaries, novel technologies, material exceptions, and high-impact systems.

## Common failure patterns
Approval bureaucracy, undocumented review criteria, permanent exceptions, stale standards, duplicated controls, and governance metrics focused only on review volume.

## Verification
Confirm review criteria, ownership, exception lifecycle, automated guardrails, and feedback loops operate on representative projects.

## Expected output
A security architecture governance model with review tiers, standards lifecycle, exception handling, metrics, and accountable owners.

## Stop conditions
Stop when decision authority is undefined, governance conflicts with mandatory organizational policy, or proposed controls cannot be enforced or verified.