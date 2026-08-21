# Pagination Contract Consistency Gate Workflow

## Trigger
A paginated endpoint/query is added, modified, migrated between pagination styles, performance-tuned, or implicated in missing/duplicated item reports.

## Entry conditions
Target endpoint/query and repository are known; safe local/test execution is available.

## Inputs
Request/response contract, ordering rules, pagination implementation, data mutation expectations, tests/logs/query plans.

## Stages
1. **Context** — Pagination Investigator maps API parameter → query → ordering → response continuation/page metadata.
2. **Static scan** — run `python3 scripts/scan-pagination.py <repo> --output pagination-scan.json`; exit 1 means review findings, not automatic failure.
3. **Contract model** — classify style, ordering tuple, unique tiebreaker, page-size bounds, token semantics, and mutation guarantees.
4. **Plan** — define boundary and duplicate/gap scenarios before editing.
5. **Approval checkpoint** — stop if remediation breaks the public API, changes schema, production config/deployment, or performs destructive operations.
6. **Execute** — implement the smallest approved change.
7. **Test** — cover empty, one item, exact page, page+1, final partial page, invalid token, duplicate sort values, and representative between-page mutation.
8. **Review** — inspect diff and generated query behavior; verify no silent ordering/default drift.
9. **Independent verification** — Pagination Verifier re-runs checks using item identities, not counts alone.
10. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Pagination style known; stable full ordering tuple known; page size bounded; duplicate/gap contract explicit; continuation behavior testable.

## Retry rules
Maximum two retries for transient test/tool failures. Preserve command, output, data fixture, and attempt number. Deterministic failures require diagnosis/change before another run. After two repeated transient failures, mark `blocked` and escalate.

## Failure paths
Permission/environment failure → preserve evidence and block. Contract ambiguity → block pending owner decision. Verification failure → `fail`. Dangerous remediation without approval → `needs-approval`.

## Stop conditions
Required context unavailable; public contract behavior cannot be established; approval-required action lacks approval; two repeated transient failures; independent verifier finds unresolved gaps/duplicates.

## Produced artifacts
`pagination-scan.json` when scanner runs, focused test evidence, and an assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Deterministic order and tiebreaker are verified; page bounds are safe; duplicate/gap and boundary scenarios are tested; public contract compatibility is confirmed; independent verification is complete; assessment validates; required approvals exist; remaining risks are recorded; no blocking failure remains for `pass`.
