# Code Review and Evidence Rules

## Purpose
Ensure Senior Angular decisions are reviewable, evidence-based, proportionate to risk, and reversible where possible.

## Scope
Pull requests, architecture decisions, bug fixes, performance claims, security changes, and risky implementation choices.

## MUST
- Review public contracts, state ownership, security boundaries, asynchronous behavior, accessibility, test evidence, and operational impact when affected.
- Support material performance claims with before/after measurements under comparable conditions.
- Bound bug root cause with logs, reproduction, tests, or equivalent evidence before broad corrective changes.
- Document significant architecture trade-offs, constraints, alternatives, and consequences.
- Escalate destructive, security-weakening, public-contract-breaking, or production-impacting execution for authorized human approval.

## MUST NOT
- Treat agent confidence, code aesthetics, or framework popularity as evidence.
- Approve a change whose critical failure mode has no verification strategy.
- Mix unrelated large refactors into a risky fix without explicit justification.

## SHOULD
- Prefer small, reversible changes that preserve diagnostic evidence and make review intent clear.

## Exceptions
Urgent incident fixes may reduce documentation before execution only under authorized emergency process; evidence and rationale must be captured afterward.

## Verification
Inspect PR diff, test/CI results, benchmarks, security evidence, architecture notes, approvals, and production verification plan.