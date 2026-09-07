# Release Strategy Rules

## Purpose
Define how a Senior Release Manager establishes a release approach that balances customer value, operational safety, reversibility, and organizational constraints.

## Scope
Applies to production-bound software, infrastructure, data, configuration, and externally visible release trains.

## MUST
- Release strategy MUST define release objective, affected products/services, target environments, expected customer impact, risk tier, owners, and success criteria.
- High-risk releases MUST use a rollout method that limits blast radius where the platform supports it.
- The strategy MUST identify rollback, roll-forward, or containment options before production execution.
- Material trade-offs between speed, scope, reliability, compliance, and reversibility MUST be documented with evidence.
- Release assumptions and dependencies MUST be validated with accountable owners before the release window.

## MUST NOT
- A release MUST NOT be scheduled solely because implementation is complete.
- Unverified optimism or agent confidence MUST NOT substitute for readiness evidence.
- Release strategy MUST NOT silently override stricter project, security, regulatory, or operational requirements.

## SHOULD
- Releases SHOULD be decomposed so independent risk can be introduced and observed incrementally.
- Strategy SHOULD minimize simultaneous unrelated changes when failure attribution would become difficult.

## Exceptions
An exception requires documented context, reason, alternatives considered, risk, compensating controls, verification plan, and approval from the authority appropriate to the risk tier.

## Verification
Review the release plan, dependency evidence, risk classification, success criteria, rollback plan, approvals, and production verification plan before authorizing execution.