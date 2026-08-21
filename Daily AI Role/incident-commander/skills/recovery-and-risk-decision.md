# Skill: Recovery and Risk Decision

## Purpose
Choose and govern mitigations that reduce impact safely, with explicit evidence, rollback criteria, approval boundaries, and verification.

## Trigger
Use when responders propose rollback, failover, feature disablement, traffic shift, configuration change, capacity increase, data repair, dependency isolation, or another production mitigation.

## Inputs
- Current impact and severity
- Candidate actions
- Evidence supporting each action
- Blast radius
- Reversibility
- Required approvals
- Expected recovery signal
- Rollback path

## Decision framework
For every candidate action evaluate:
- Expected impact reduction
- Confidence in causal relevance
- Time to execute
- Time to observe effect
- Reversibility
- New failure modes introduced
- Data/security risk
- Dependency effect
- Operational cost
- Approval requirement

Prefer the smallest reversible action that can materially reduce harm and produce an observable result.

## Procedure
1. State the decision target: what incident symptom must improve?
2. List candidate mitigations and the evidence behind each.
3. Eliminate actions that exceed authority or lack required approval.
4. Compare blast radius and reversibility.
5. Define success metric and observation window before execution.
6. Define rollback/abort criteria before execution.
7. Obtain human approval for production actions when required by `rules/operating-rules.md`.
8. Execute only through the authorized operator/tooling path.
9. Observe the preselected signals; do not substitute unrelated green metrics after the fact.
10. Record outcome as successful, ineffective, partially effective, or harmful.
11. If ineffective, update hypotheses before the next action; do not repeat the same action without new evidence.

## Recovery verification
A service is not considered recovered because one dashboard turns green. Verify when relevant:
- User-facing success rate
- Error rate
- Latency
- Queue/backlog behavior
- Data correctness
- Dependency health
- Synthetic checks
- Customer reports
- Stability across an observation window

## Outputs
- Mitigation decision record
- Approval record/reference
- Success/rollback criteria
- Execution owner
- Verification evidence
- Residual risks

## Failure handling
- Mitigation worsens impact: abort/rollback immediately when safe, escalate severity, preserve evidence.
- Conflicting metrics: extend verification and identify the metric closest to user impact.
- Irreversible action is the only option: stop and require explicit human approval plus backup/recovery plan.
- No mitigation available: shift focus to containment, capacity protection, communication, and vendor/escalation paths.

## Stop conditions
Recovery decision work ends when impact is controlled, verification is complete, residual risk is accepted by the appropriate owner, and follow-up remediation has a named owner.