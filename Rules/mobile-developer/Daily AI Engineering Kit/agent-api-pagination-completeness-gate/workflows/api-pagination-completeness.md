# API Pagination Completeness Workflow

## Trigger
A paginated API integration is added, changed, fails synchronization, returns suspicious counts, or must be proven complete.

## Entry conditions
A safe read-only execution path exists and the pagination contract can be identified or investigated.

## Inputs
Endpoint, pagination mode, item identity, credentials supplied externally, repository code/tests, and acceptance criteria.

## Stages
1. **Context — API Explorer**: trace request construction, next-page derivation, ordering, termination, and retry handling.
2. **Baseline — API Explorer**: run existing tests and a safe pagination probe. Save evidence.
3. **Decision**: if behavior is already verified, skip remediation. If a defect is evidenced, proceed.
4. **Plan — implementation owner**: select the smallest compatible correction and regression test.
5. **Execute — implementation owner**: implement only the evidenced fix.
6. **Test — implementation owner**: run focused tests, then relevant suite.
7. **Verify — Verification Agent**: independently run the gate and inspect the diff/result contract.
8. **Complete**: publish verification evidence and remaining risk.

## Tools
Repository search/diff, test runner, HTTP GET, `scripts/pagination_gate.py`, `scripts/verify_package.py`.

## Produced artifacts
`pagination-result.json`, test output, optional remediation diff, and a report based on `templates/pagination-report.md`.

## Checkpoints
- Pagination mode and termination rule are explicit before remediation.
- A failing symptom is reproduced or supported by logs before changing code.
- Verification is independent of the implementing agent.

## Retry rules
Each transient page failure may be retried at most two times. A test-fix-retest remediation loop may run at most two implementation attempts. Preserve failed target, HTTP status/error, result JSON, and test output before retrying.

## Approval points
Stop for explicit human approval before production deployment, production configuration changes, credential/secret changes, breaking API changes, destructive data operations, or infrastructure changes.

## Failure paths
- Authentication/permission failure: `blocked`; do not increase privilege.
- Invalid/ambiguous API contract: `blocked`; obtain authoritative evidence.
- Repeated cursor/target: `partial`; stop to avoid infinite loop.
- Safety cap reached: `partial`; preserve evidence and escalate.
- Build/test failure after two remediation attempts: stop and report unresolved failure.

## Stop conditions
Verified completion, blocking permission/contract issue, detected loop, configured safety cap, or exhausted remediation attempts.

## Definition of Done
The terminal condition is evidenced; tests pass; the gate reports `verified-complete`; result fields are valid; no unintended diff remains; any required approval exists; remaining risks are documented.
