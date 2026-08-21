# Final Architecture Review Checklist

## Objective and traceability
- [ ] Goal, scope, owner, and success metrics are explicit.
- [ ] Functional requirements are identified and traceable.
- [ ] Critical NFRs are quantified or explicitly marked unresolved.
- [ ] Facts, assumptions, hypotheses, and open questions are separated.

## Design quality
- [ ] Boundaries and ownership are clear.
- [ ] Data authority, consistency, lifecycle, and reconciliation are defined.
- [ ] Interfaces include compatibility/versioning expectations.
- [ ] Failure propagation, timeouts, retries, idempotency, and degradation are considered where relevant.
- [ ] Security/trust boundaries and sensitive data paths are reviewed.
- [ ] Capacity and cost claims are backed by workload assumptions/evidence.
- [ ] Observability and operational ownership are actionable.

## Change safety
- [ ] Dependencies and blast radius are known.
- [ ] Migration/coexistence strategy is feasible.
- [ ] Rollback or an explicitly approved irreversibility plan exists.
- [ ] Breaking changes have consumer/deprecation strategy.

## Review and evidence
- [ ] Required specialist reviews are completed.
- [ ] Blockers are closed.
- [ ] Major findings have owner, mitigation, or accepted residual risk.
- [ ] Verification plan includes measurable thresholds.
- [ ] ADRs exist for consequential decisions.

## Authority and completion
- [ ] Required human approvals are recorded.
- [ ] No secret or destructive command is embedded casually.
- [ ] Deliverables can be understood and continued by intended stakeholders.
- [ ] No blocking dependency remains.