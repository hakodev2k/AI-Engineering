# Architecture Assurance Rules

## Purpose
Verify that approved architecture intent survives implementation and production operation.

## Scope
Design assurance, implementation conformance, pre-production readiness, post-deployment validation, and exception closure.

## MUST
- High-risk initiatives MUST define architecture acceptance evidence before implementation completes.
- Material deviations from approved architecture MUST be assessed for impact and either approved or remediated.
- Production readiness MUST verify security, resilience, observability, support ownership, data obligations, and rollback or recovery where relevant.

## MUST NOT
- MUST NOT treat design approval as proof of implementation compliance.
- MUST NOT close architecture risks without evidence that required controls or remediation exist.

## SHOULD
- Use automated conformance tests and policy checks for deterministic requirements.

## Exceptions
Deferred remediation requires owner, risk acceptance, due date, and compensating controls.

## Verification
Inspect CI policy results, implementation reviews, readiness evidence, production telemetry, and exception closure records.