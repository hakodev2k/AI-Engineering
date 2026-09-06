# Requirements, Risk, and Stakeholder Communication

## Purpose
Translate automation requests into explicit requirements, risks, acceptance criteria, ownership, and technical decisions that stakeholders can review before implementation.

## When to use
Use for new automations, material changes, cross-team integrations, high-impact workflows, or projects with conflicting goals or ambiguous ownership.

## Inputs
Business request, process evidence, stakeholder list, system constraints, policy requirements, SLAs, data classification, budget, and target timeline.

## Context to inspect
Inspect current process outcomes, prior incidents, architecture, system owners, user/operator expectations, contractual obligations, and existing metrics.

## Core knowledge
Senior automation engineering distinguishes requirements from implementation preferences. Functional behavior, non-functional requirements, failure semantics, ownership, and risk tolerance must be explicit. Trade-offs should be communicated in terms of business consequences.

## Procedure
1. Identify the decision owner, process owner, operators, security/data owners, and affected users.
2. Restate the desired business outcome in measurable terms.
3. Capture functional behavior including exceptions and manual paths.
4. Define non-functional requirements for latency, throughput, availability, recovery, security, privacy, audit, and retention.
5. Document external dependencies and ownership boundaries.
6. Identify assumptions and validate the highest-risk ones first.
7. Build a risk register covering data, security, operational, vendor, financial, and change risks.
8. Define acceptance criteria based on observable outcomes.
9. Present architecture options with trade-offs rather than a single unexplained recommendation.
10. Record decisions and unresolved questions.
11. Define operational ownership, escalation, and support expectations before launch.
12. Revisit requirements when evidence or constraints materially change.

## Decision points
Escalate decisions whose risk tolerance belongs to product, security, legal, finance, or business owners. Prefer a simpler design when it meets the same verified outcomes with lower operational burden.

## Common failure patterns
Treating a tool choice as a requirement, vague success criteria, hidden assumptions, no owner for failures, promising unrealistic reliability, and communicating only implementation details instead of consequences.

## Verification
Have relevant owners review the requirements and trace each acceptance criterion to a business outcome or risk control. Confirm support and escalation ownership are explicit.

## Expected output
An approved requirements and decision package with scope, NFRs, assumptions, risks, trade-offs, acceptance criteria, owners, and operational expectations.

## Stop conditions
Stop when critical stakeholders disagree on the intended outcome, risk ownership is missing, acceptance criteria cannot be defined, or legal/security decisions exceed engineering authority.