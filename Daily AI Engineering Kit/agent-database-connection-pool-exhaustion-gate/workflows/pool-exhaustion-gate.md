# Workflow: Database Connection Pool Exhaustion Gate

## Trigger
Run when a change touches database connection creation, EF Core/ADO.NET lifetime, transaction handling, retry logic, worker concurrency, or when an incident suggests pool exhaustion.

## Entry conditions
- Repository root is available.
- Relevant code/config can be inspected.
- No approval-required production action is needed merely to investigate.

## Inputs
Changed files, repository root, database provider, test/build commands, optional incident evidence.

## Context
DI registrations, database abstractions, handlers/jobs/consumers, transaction boundaries, retry policies, connection configuration, nearby tests.

## Stages
1. **Context discovery — Pool Investigator**
   - Locate entry points, DI lifetimes, connection creation/disposal, transactions, retries, concurrency.
   - Run `python scripts/scan-pool-risk.py <repo> --json`.
   - Preserve scanner output.
2. **Risk classification — Pool Investigator**
   - Classify scanner findings as confirmed, false positive, or unresolved using code evidence.
   - Estimate peak connection demand where possible.
3. **Plan — Pool Investigator**
   - Choose smallest safe remediation and targeted tests.
   - Stop for approval if remediation requires production connection-string, infrastructure, schema, or destructive DB changes.
4. **Execute — Implementation owner**
   - Apply only approved/code-local changes.
   - Do not broaden scope to unrelated refactors.
5. **Test — Implementation owner**
   - Run targeted unit/integration tests and repository build/lint commands relevant to changed code.
6. **Re-scan — Pool Investigator**
   - Re-run scanner and update assessment JSON.
7. **Independent verify — Pool Verifier**
   - Inspect final diff, tests, scanner result, disposal/lifetime/concurrency behavior.
   - Run `python scripts/validate-assessment.py <assessment.json>`.
8. **Complete or rework**
   - `pass` only if verification succeeds.
   - Rework is bounded to 2 fix-retest cycles.

## Produced artifacts
- Scanner output.
- Assessment JSON matching `schemas/assessment.schema.json`.
- Test/build evidence.
- Final verification decision.

## Checkpoints
- Before edits: evidence gathered.
- Before approval-required action: stop and request explicit human approval.
- Before completion: scanner, tests, diff review, assessment validation, independent verification.

## Retry rules
Maximum 2 fix-retest cycles. Retryable failures: implementation-caused test failure, scanner finding that can be safely corrected, transient test/tool failure once per command. Preserve previous scanner/test output. After the second failed cycle, mark `blocked` or `fail` and escalate.

## Stop conditions
Verified `pass`; explicit approval required; permission/environment blocks safe evidence collection; or retry budget exhausted.

## Approval points
Production connection-string/pool settings, database schema changes, destructive SQL, infrastructure changes, secret changes, production deployment/config changes.

## Failure paths
- Tool/transient failure: retry once, preserve error, then escalate.
- Validation failure: correct assessment only if evidence supports it; never edit evidence to force pass.
- Test/build failure: bounded fix-retest loop.
- Permission failure: stop without privilege escalation.
- Missing production evidence: use code/test evidence and mark unresolved risk; do not fabricate certainty.

## Definition of Done
- Relevant connection lifetimes and concurrency paths were traced.
- No unresolved high/critical pool-exhaustion finding remains.
- Scanner exit code is 0 or every residual scanner finding is demonstrably a false positive and the assessment status is not falsely marked pass by the validator contract.
- Required tests/build checks pass.
- Final diff was reviewed.
- Assessment validates.
- Independent verifier returns `pass`.
- Required approval exists for any approval-bound action.
