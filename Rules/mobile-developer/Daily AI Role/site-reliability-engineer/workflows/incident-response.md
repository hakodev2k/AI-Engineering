# Workflow: Incident Response

## Trigger
Material production degradation or outage.

## Goal
End user impact safely and preserve a trustworthy operational record.

## Stages
1. **Declare** — SRE coordinator assigns severity, commander, scope, communication cadence.
2. **Parallel evidence** — Telemetry Researcher inspects service, dependency, and recent-change evidence while commander checks known runbooks.
3. **Mitigation decision** — Commander ranks reversible options by expected recovery value and risk.
4. **Approval checkpoint** — human approval for irreversible/destructive/high-blast-radius action.
5. **Execute** — Mitigation Executor performs one bounded action and records result.
6. **Loop** — maximum 3 materially different mitigation attempts before mandatory escalation; failed identical attempts are not repeated blindly.
7. **Verify** — Verification Agent confirms critical journey and telemetry recovery.
8. **Stabilize** — monitor through a defined period appropriate to the failure mode.
9. **Close/handoff** — residual risk, owner, deadlines, follow-up.

## Dependencies
Mitigation execution requires sufficient evidence or a justified emergency action. Closure requires verification.

## Failure/Escalation
Escalate for security/data loss, missing access, uncertain destructive action, repeated mitigation failure, or dependency owner intervention.

## Definition of Done
Impact ended, recovery proven, timeline complete, residual risk owned, communication sent.