# Non-functional Requirements

## Purpose
Translate product expectations for performance, reliability, security, accessibility, privacy, and operability into explicit decision and acceptance constraints.

## When to use
Use when a capability has material quality attributes beyond functional behavior, especially high-scale, regulated, critical, or customer-facing workflows.

## Inputs
User expectations, SLAs/SLOs, policies, architecture context, traffic profile, accessibility needs, security requirements, and operational history.

## Context to inspect
Inspect existing service objectives, production baselines, incident history, compliance requirements, platform limits, and monitoring capability.

## Core knowledge
Non-functional requirements must be measurable and proportional to business impact. Universal maximum standards can create unnecessary cost; vague quality language creates hidden risk.

## Procedure
1. Identify quality attributes that materially affect the outcome.
2. Establish current baselines where available.
3. Define measurable thresholds and relevant conditions.
4. Distinguish hard constraints from targets.
5. Review feasibility and cost with engineering.
6. Define verification method before implementation.
7. Include operational and recovery expectations.
8. Capture accessibility, privacy, and security constraints explicitly.
9. Add story-specific criteria only where they differ from global standards.
10. Revisit thresholds using production evidence.

## Decision points
Use stricter targets for critical paths and looser targets where marginal quality has little user value. Prefer SLO-style objectives over impossible absolutes.

## Common failure patterns
Using words such as scalable without numbers, copying enterprise standards blindly, missing peak conditions, and defining targets that cannot be measured.

## Verification
Each material quality attribute has a measurable threshold, test or monitoring method, and accountable acceptance decision.

## Expected output
A concise set of measurable non-functional requirements tied to product impact.

## Stop conditions
Escalate when regulatory, security, accessibility, or contractual standards require specialist interpretation.