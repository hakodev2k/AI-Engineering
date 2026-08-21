# Revalidate Approval Context

## Purpose
Detect whether an approval still applies at the exact execution point.

## Inputs
Previously approved context, current context reconstructed from live repository/tool state, approval record, optional independent review, and policy.

## Procedure
1. Re-read the current repository revision and target environment.
2. Rebuild plan/resource/command/permission fingerprints from what will actually execute.
3. Run `python3 scripts/evaluate-context-drift.py approved-context.json current-context.json --output drift.json`.
4. If status is `drifted`, stop. Record changed fields and obtain a new approval for the new context; never patch the old approval.
5. If high/critical, obtain an independent review bound to the current fingerprint. Reviewer must differ from executor.
6. Run `python3 scripts/evaluate-final-gate.py current-context.json approval.json --review review.json` when review is required.
7. Execute only when final gate returns `verified`.
8. Record execution separately from verification; gate success does not prove the external action occurred.

## Verification
Approval, review, and current context must share the same fingerprint. Repository revision and target environment must be current.

## Retry policy
Transient state-read/tool failure: maximum one retry. Fingerprint mismatch, changed plan, changed resources, changed permissions, changed environment, rejected approval, or self-review are deterministic and are not retried.

## Stop conditions
Any material drift, missing approval, approval rejection, insufficient permissions, or inability to reconstruct current context stops execution.
