# Change Review and Approval Rules

## Purpose
Ensure Senior-level engineering judgment and explicit authority boundaries govern high-impact real-time changes.

## Scope
Architecture, scheduler, timing, concurrency, safety, security, production, and dependency changes.

## MUST
- Significant changes MUST identify affected timing contracts, resource bounds, failure modes, compatibility constraints, and rollback or safe-state strategy.
- Reviews MUST require evidence appropriate to the claimed outcome, including timing measurements or analysis where performance is affected.
- Production deployment, safety-control weakening, irreversible device actions, destructive data operations, and high-risk access changes MUST require explicit human approval.
- AI or automation MUST distinguish analysis, recommendation, preparation, and execution and MUST NOT exceed granted authority.

## MUST NOT
- MUST NOT approve a timing-sensitive change solely because functional tests pass.
- MUST NOT force push, rewrite shared history, bypass required reviewers, or suppress failing safety checks to accelerate release.
- MUST NOT claim risk is acceptable without identifying who accepts it and on what evidence.

## SHOULD
- Prefer reversible, staged changes with measurable acceptance and abort conditions.

## Exceptions
Exceptions require context, evidence, alternatives considered, residual risk, named approval, and follow-up verification.

## Verification
Inspect pull requests, review records, timing evidence, approvals, deployment gates, rollback plans, audit logs, and post-change measurements.