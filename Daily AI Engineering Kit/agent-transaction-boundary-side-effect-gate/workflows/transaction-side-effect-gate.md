# Transaction Boundary Side-Effect Gate Workflow

## Trigger
A change or incident path combines database persistence/transactions with external side effects.

## Entry conditions
Repository and diff base are available; required production mutations are excluded.

## Inputs
Task scope, acceptance criteria, diff base, source/tests/config, optional incident evidence.

## Flow
```text
Trigger -> Scan -> Investigate -> Plan -> Approval gate -> Implement -> Test -> Independent verify -> Complete
                              \-> rejected/unknown ------------------------------> Report
```

## Stages
1. **Scan — Investigator:** run the pre-task hook and preserve `.ai/transaction-side-effects.json`.
2. **Investigate — Investigator:** classify candidates and prove ordering/failure windows.
3. **Plan — Investigator:** select minimal remediation and verification cases.
4. **Approval gate:** stop if the plan needs schema/destructive SQL/production writes/infrastructure/secrets/breaking contracts/security weakening/irreversible migration.
5. **Implement — Implementer:** apply only confirmed, approved changes using `skills/remediate-atomicity-gap.md`.
6. **Test — Implementer:** test happy path and asymmetric failures.
7. **Verify — Verifier:** execute `hooks/final-verification.md` independently.
8. **Complete:** record evidence, remaining risks, approvals, and final status.

## Artifacts
Scanner report, investigation findings, diff, test/build logs, verification status, approval record when applicable.

## Retry rules
Shared maximum: two fix/test retries. Retry only build/test failures plausibly caused by the current diff or transient local tool failures. Preserve the previous failure, command, output, and changed hypothesis. Permission failures and missing approval are not retryable.

## Failure paths
Tool/environment failure -> preserve evidence and stop if not resolved safely. Unknown transaction ownership -> human escalation. Verification failure -> implementer while retry budget remains. Approval missing -> blocked. Production-only reproduction -> use non-mutating evidence or stop.

## Definition of Done
- All candidates are classified with evidence.
- Every confirmed failure window is fixed or explicitly accepted with required approval.
- Applicable build/tests pass, including asymmetric failure tests.
- Independent verifier returns `verified`.
- No unapproved dangerous action or unrelated diff remains.
- Remaining risks/open questions are recorded.
