# Risk, Evidence, and Approval Rules

## Purpose
Ensure Senior database reliability decisions are evidence-based, reversible where possible, and executed within clear authority.

## Scope
Production changes, destructive actions, architecture decisions, exceptions, and operational recommendations.

## MUST
- Support material production conclusions with logs, metrics, plans, tests, or equivalent evidence.
- Document trade-offs, blast radius, reversibility, and rollback for high-risk changes.
- Require explicit human approval before destructive data changes, irreversible migrations, production failover outside declared incident authority, or security-control weakening.
- Distinguish analysis, recommendation, preparation, and execution authority.

## MUST NOT
- Do not treat operator or agent confidence as evidence.
- Do not silently exceed delegated authority.
- Do not execute irreversible production actions without required approval and recovery evidence.

## SHOULD
- Prefer staged, observable, reversible changes with deterministic verification.

## Exceptions
Emergency execution is permitted only under established incident authority and must be documented and reviewed afterward.

## Verification
Inspect change records, approvals, test evidence, rollback plans, incident authority, and post-change validation.