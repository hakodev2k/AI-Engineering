# Policy as Code Rules

## Purpose
Translate enforceable compliance requirements into versioned, reviewable, automated policy checks where practical.

## Scope
Applies to infrastructure, cloud configuration, CI/CD, identity, repositories, containers, and other systems supporting machine-verifiable policy.

## MUST
- Policy code MUST be version controlled, peer reviewed, tested, and traceable to control requirements.
- Enforcement behavior MUST distinguish blocking controls from advisory checks.
- Policy changes that weaken a material control MUST require explicit risk review and approval.
- False-positive and false-negative risks MUST be considered when designing enforcement logic.

## MUST NOT
- Policy checks MUST NOT be disabled or bypassed silently.
- A policy engine result MUST NOT be treated as complete assurance when the requirement includes human or procedural elements.
- Emergency bypass mechanisms MUST NOT become permanent undocumented exceptions.

## SHOULD
- Include unit or fixture tests for compliant and noncompliant examples.
- Make policy failure messages actionable and reference the violated control.

## Exceptions
Approved bypasses require reason, scope, owner, expiry, compensating controls, and post-event review.

## Verification
Review policy source, tests, CI results, bypass logs, approvals, and control traceability.