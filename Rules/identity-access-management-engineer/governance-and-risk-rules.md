# Governance and Risk Rules

## Purpose
Ensure IAM decisions are owned, risk-based, evidence-backed, and reversible where practical.

## Scope
Policy ownership, standards, exceptions, risk acceptance, architecture decisions, control evidence, and senior escalation.

## MUST
- Material IAM decisions MUST identify requirements, constraints, alternatives, security impact, operational impact, and accountable owner.
- Exceptions MUST be time-bounded and tracked to closure or explicit renewal.
- High-risk actions such as weakening authentication, expanding privileged access, rotating critical keys, or changing production trust MUST require authorized human approval before execution.
- Control effectiveness claims MUST rely on tests, configuration inspection, telemetry, audits, or equivalent evidence.

## MUST NOT
- MUST NOT treat agent confidence, convention, or undocumented precedent as evidence.
- MUST NOT allow temporary exceptions to become permanent through inaction.
- MUST NOT silently exceed delegated authority when preparing or executing IAM changes.

## SHOULD
- Prefer reversible decisions and staged adoption when uncertainty or blast radius is high.

## Exceptions
Risk acceptance requires reason, evidence, alternatives, impact, compensating controls, expiry, and accountable approval.

## Verification
Review decision records, exception register, approvals, control evidence, overdue risks, and post-change outcomes.