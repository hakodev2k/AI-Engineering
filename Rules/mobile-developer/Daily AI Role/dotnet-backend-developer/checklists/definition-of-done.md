# Definition of Done — .NET Backend Work

A task is complete only when every applicable blocking item is satisfied.

## Objective and scope
- [ ] Original objective is restated in verifiable terms.
- [ ] Acceptance criteria are mapped to implementation/evidence.
- [ ] Assumptions and intentionally deferred scope are recorded.
- [ ] No unrelated change remains unexplained.

## Correctness
- [ ] Main success behavior is implemented.
- [ ] Important edge/failure cases are handled.
- [ ] Concurrency/idempotency requirements are addressed where applicable.
- [ ] Data invariants are enforced at an appropriate boundary.

## API and security
- [ ] Public contract changes are intentional and approved.
- [ ] Input validation is server-side.
- [ ] Authentication/authorization remains correct.
- [ ] No secrets or unnecessary sensitive data appear in source/logs/output.

## Persistence and integrations
- [ ] EF Core/SQL query behavior is understood for material paths.
- [ ] Transaction and migration risks are handled.
- [ ] External calls define timeout, cancellation, retry classification, and failure behavior.

## Quality
- [ ] Relevant build succeeds.
- [ ] Relevant automated tests pass.
- [ ] Regression tests cover changed behavior when practical.
- [ ] Code review has no unresolved blocking findings.
- [ ] Final diff has been inspected.

## Operability
- [ ] Important failures are observable.
- [ ] Logs/metrics/traces avoid sensitive data.
- [ ] Rollback/recovery implications are recorded for risky work.

## Evidence and approval
- [ ] Verification evidence exists for every blocking acceptance criterion.
- [ ] Remaining risk is documented.
- [ ] Required human approvals have been obtained before any guarded execution step.
- [ ] No blocking issue remains.
