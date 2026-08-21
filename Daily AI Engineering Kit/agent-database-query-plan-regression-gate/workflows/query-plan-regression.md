# Workflow: Query Plan Regression Gate

## Trigger
A proposed or completed code change can alter database query behavior/performance.

## Entry conditions
Repository available; task scope known; approved diagnostic environment available.

## Inputs
Acceptance criteria, relevant query, config thresholds, baseline/candidate plan evidence.

## Stages
1. **Context — Query Investigator:** trace entry point, query, generated SQL, tests, schema/index context.
2. **Baseline checkpoint:** capture comparable baseline plan; block if unavailable and no explicit waiver.
3. **Plan:** identify smallest safe implementation scope and expected plan invariants.
4. **Execute — Implementation owner:** make scoped change; stop before approval-required actions.
5. **Functional checkpoint:** build/test relevant behavior.
6. **Candidate:** capture candidate plan under baseline conditions.
7. **Gate:** run `scripts/query_plan_gate.py`.
8. **Triage:** on regression, use `skills/regression-triage.md`; maximum two fix cycles.
9. **Verify — Verification Agent:** independently inspect report, tests, diff, approvals.
10. **Complete:** emit verified evidence and residual risks.

## Tools
Repository tools, project test/build tooling, database plan capture tools, Python gate.

## Produced artifacts
Plan files, analyzer JSON report, test/build logs, verification result.

## Retry rules
- transient plan/tool failure: max 2 retries; preserve stderr/logs
- failed gate after code change: max 2 fix cycles
- validation/permission failure: no blind retry

## Approval points
Index/schema/migration changes, production executing diagnostics, production configuration, destructive SQL, deployment, breaking API changes.

## Failure paths
Non-comparable evidence -> blocked. Permission failure -> blocked. Functional failure -> return to implementation within remaining retry budget. Gate regression -> triage. Retry budget exhausted -> failed with evidence.

## Stop conditions
Approval required, invalid evidence, two unsuccessful fix cycles, or unresolved functional failure.

## Definition of Done
Comparable evidence exists; functional checks pass; deterministic gate passes; independent verification passes; no pending approval; residual risk documented.