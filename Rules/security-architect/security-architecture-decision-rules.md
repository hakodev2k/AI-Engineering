# Security Architecture Decision Rules

## Purpose
Make significant security architecture decisions explicit, reviewable, evidence-based, and reversible where practical.

## Scope
Major control choices, trust changes, technology selections, security exceptions, migrations, and architectural trade-offs.

## MUST
- Significant security decisions MUST document context, constraints, options considered, selected approach, risks, and verification evidence.
- Decisions that weaken an existing control MUST identify compensating controls, blast radius, rollback, and accountable approval.
- Security assumptions MUST be recorded separately from verified facts when they materially influence the decision.
- Decisions affecting public contracts, privileged access, regulated data, or production control planes MUST receive appropriate human review before execution.
- Superseded decisions MUST remain traceable to their replacements.

## MUST NOT
- MUST NOT use personal preference or agent confidence as sufficient evidence for a high-impact decision.
- MUST NOT conceal material security trade-offs inside implementation details.
- MUST NOT execute irreversible architecture changes without authorized approval and a validated migration plan.

## SHOULD
- Prefer options with narrow blast radius, observable behavior, and feasible rollback when security outcomes are otherwise comparable.

## Exceptions
Urgent exceptions require documented incident context, decision authority, residual risk, compensating controls, and post-event review.

## Verification
Inspect architecture decision records, review approvals, threat models, test evidence, rollback plans, and implementation diffs.