# Tool Output Schema Drift Gate Workflow

## Trigger
A tool response fails parsing/validation, a provider/tool version changes, or autonomous use of a new tool response is being enabled.

## Entry conditions
A sanitized response sample and expected contract are available. If no sample can be obtained safely, stop as blocked.

## Inputs
Response JSON, canonical schema, fixtures, adapter code, acceptance criteria.

## Context
Inspect the adapter and direct consumers first; expand only from evidence.

## Stages
1. **Preflight — Contract Investigator**: run repository and fixture checks using `python scripts/preflight.py`.
2. **Validate — Contract Investigator**: run `validate-tool-output.py`; create a drift report on failure.
3. **Impact — Contract Investigator**: trace changed fields into decisions, writes, retries, approvals, and completion checks.
4. **Approval checkpoint**: stop for human approval if the proposed fix changes a public contract, weakens validation, changes permissions/config/secrets, or requires production mutation.
5. **Implement — Adapter Implementation Agent**: follow `skills/adapt-contract-safely.md`.
6. **Test — Adapter Implementation Agent**: run `python scripts/run-contract-tests.py`. Maximum two implementation/test attempts.
7. **Inspect — Adapter Implementation Agent**: run `python scripts/inspect-changes.py`.
8. **Verify — Verification Agent**: independently rerun tests and inspect failure behavior.
9. **Complete** only when verification status is `verified`.

## Retry rules
Tool calls may be retried at most twice only for timeout, rate-limit, or temporary transport failures. Preserve attempt timestamps and errors. Validation failures are never retried as transient failures. Implementation/test fixes are limited to two attempts.

## Failure paths
- Malformed or incompatible response: preserve redacted evidence and stop.
- Permission failure: stop; never increase permission automatically.
- Tests still failing after two attempts: stop and report evidence.
- Ambiguous control field: stop for human decision.

## Produced artifacts
Drift report, normalized fixtures, test results, diff inspection, and verification status.

## Definition of Done
The new/known-good fixtures validate, invalid fixtures fail closed, affected consumers use canonical fields, tests pass, diff is scoped, required approval exists, and independent verification is `verified`.