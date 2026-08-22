# Release Readiness Workflow

## Trigger
A change is functionally complete and considered for production release.

## Checks
- acceptance criteria verified
- blocking review findings closed
- migrations reviewed and reversible/recoverable
- compatibility impact known
- telemetry and alerting appropriate
- deployment ordering defined
- rollback/fallback documented
- known risks accepted by appropriate owner
- runbook/support notes updated when relevant
- required human approvals present

## Decision
GO only when evidence supports readiness. CONDITIONAL GO requires explicit risk owner and mitigation. NO-GO for unresolved P0/P1, unsafe migration, missing rollback on high-risk change, or unverified critical behavior.

## Output
Decision, evidence, risks, approvals, release steps, rollback trigger, and post-release verification plan.