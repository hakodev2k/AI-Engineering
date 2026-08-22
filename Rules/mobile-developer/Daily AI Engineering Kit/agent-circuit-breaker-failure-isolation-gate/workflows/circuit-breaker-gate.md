# Circuit Breaker Failure Isolation Gate

## Trigger
Dependency timeout/5xx incident, retry storm, resilience-policy change, or new critical outbound integration.

## Entry conditions
Repository is readable; target dependency/operation is identifiable; current diff is understood.

## Inputs
Target operation, acceptance criteria, repository, available logs/traces, current resilience configuration.

## Flow
`Trigger -> Context -> Investigate -> Plan -> Implement -> Test -> Independent Verify -> Complete`

1. **Context — owner:** identify entry points, callers, tests and configuration.
2. **Investigate — Resilience Investigator:** execute `skills/investigate-failure-isolation.md`; run `python scripts/scan-resilience.py --root . --policy config/gate-policy.json`.
3. **Checkpoint:** stop if idempotency, failure semantics, or production-only evidence is required and unavailable.
4. **Plan — implementation owner:** define timeout budget, retryable failures, attempt cap, circuit scope/threshold, half-open probes, fallback and telemetry.
5. **Approval point:** stop before production config/deployment, infrastructure, breaking API or security weakening.
6. **Implement:** follow `skills/design-resilience-change.md`; make the smallest safe change.
7. **Test:** run targeted unit/integration tests plus forced dependency failure/recovery scenarios.
8. **Retry rule:** at most 2 retries for transient tool/environment failures; preserve prior outputs. Logic/test failures require a new hypothesis, not blind retry.
9. **Independent Verify — Verification Agent:** rerun scanner/tests, inspect diff and confirm rules.
10. **Complete:** record status and unresolved risks.

## Failure paths
- Permission failure: no privilege escalation; mark blocked.
- Environment/tool failure: retry at most twice, then preserve evidence and stop.
- Validation/test failure: return to planning once with new evidence; second unresolved failure stops.
- Business-rule ambiguity: `needs-review`; do not guess fallback semantics.

## Definition of Done
Failure boundary mapped; attempts/timeouts bounded; retry classification verified; breaker behavior tested when applicable; cancellation preserved; scanner/tests pass or findings are explicitly resolved; independent verification passes; approvals exist for any approval-required action; no blocking risk remains.
