# Cloud Governance and Policy

## Purpose
Translate organizational requirements into enforceable cloud guardrails without blocking legitimate engineering work.

## When to use
Use for estate growth, compliance, platform standardization, resource sprawl, and policy exceptions.

## Inputs
Security standards, compliance obligations, resource hierarchy, allowed services/regions, ownership model.

## Context to inspect
Organization policies, subscriptions/accounts, tags, resource locks, policy engines, exceptions, audit findings.

## Core knowledge
Effective governance uses preventive, detective, and corrective controls. Guardrails should encode high-value invariants while preserving team autonomy inside safe boundaries.

## Procedure
1. Convert requirements into explicit control objectives.
2. Identify scope and resource hierarchy.
3. Classify controls as deny, audit, remediate, or advisory.
4. Implement policy as code where possible.
5. Roll out in audit mode before broad denial when impact is uncertain.
6. Define exception owner, justification, expiry, and review.
7. Enforce ownership and cost metadata.
8. Monitor compliance drift.
9. Measure false positives and developer friction.
10. Review controls as services evolve.

## Decision points
Use hard deny for high-confidence dangerous states; use detective controls when legitimate exceptions are frequent or provider behavior is complex.

## Common failure patterns
Policies without owners, permanent exceptions, controls applied globally without testing, manual spreadsheets, and governance that cannot explain business purpose.

## Verification
Attempt representative compliant and noncompliant deployments and confirm expected enforcement and evidence.

## Expected output
A governed estate with automated controls and bounded exceptions.

## Stop conditions
Escalate conflicting regulatory requirements or controls with broad unassessed production impact.