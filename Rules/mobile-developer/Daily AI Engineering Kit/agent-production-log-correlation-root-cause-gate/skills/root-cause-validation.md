# Root Cause Validation

## Purpose
Convert correlated production evidence into a testable root-cause claim and verify the smallest safe corrective action.

## Inputs
- `artifacts/log-correlation-evidence.json`.
- Relevant repository modules, configuration, tests, and deployment metadata.
- Incident acceptance criteria.

## Preconditions
Evidence bundle is schema-valid and contains no unresolved secret exposure.

## Procedure
1. Read the failure boundary and all competing hypotheses.
2. Trace repository entry points corresponding to the first abnormal event.
3. Locate state mutations, external calls, retries, timeouts, queues, database operations, and error handling on that path.
4. Match code/config behavior to evidence; label unmatched assumptions as hypotheses.
5. Reproduce in a non-production environment when feasible.
6. Implement the smallest safe change only if the user/task permits code changes.
7. Add or update a test that fails before the fix and passes after it whenever reproducible.
8. Run focused tests, then the relevant broader suite.
9. Inspect the diff for unrelated changes and public-contract changes.
10. Produce `artifacts/root-cause-report.md` from `templates/root-cause-report.md`.

## Verification
A root cause is `verified` only when evidence links the incident to a specific failure mechanism and either reproduction or deterministic validation confirms that mechanism. Otherwise report `probable` or `inconclusive`.

## Failure handling
Build/test failures caused by the candidate fix may be retried twice after preserving output. Environment or permission failures are not fix retries; record and stop. Never weaken tests or security controls to obtain a passing result.

## Approval boundary
Stop before production deployment, production configuration change, database migration, destructive operation, secret rotation, breaking API change, or infrastructure modification.

## Completion criteria
- Root-cause confidence is explicit.
- Evidence references support every causal step.
- Verification status is explicit.
- Remaining risks and missing evidence are recorded.
