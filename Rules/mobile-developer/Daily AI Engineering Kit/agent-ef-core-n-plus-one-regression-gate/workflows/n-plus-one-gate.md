# EF Core N+1 Regression Gate Workflow

## Trigger
A slow EF Core endpoint/job, suspected lazy-loading regression, loop-based data access, or PR that changes navigation loading/projections.

## Entry conditions
Target flow is known and can be exercised outside production.

## Inputs
Target endpoint/job, repository, representative dataset size, current tests, query logs/interceptor support.

## Stages
1. **Context** — Query Investigator maps entry point, DbContext/repository calls, materialization points, navigation access, filters and result contract.
2. **Static scan** — run `python3 scripts/scan-n-plus-one.py <repo> --output scan.json`; exit 1 means findings require review, not automatic failure.
3. **Baseline** — execute the same logical flow at representative input sizes (prefer N=1 and N=10) and record query count/result.
4. **Hypothesis** — prove or reject query-count growth with N; isolate one cause at a time.
5. **Plan** — choose the smallest semantics-preserving remedy and define focused tests/query-count assertions.
6. **Approval checkpoint** — stop if remediation requires schema change, production config/deployment, breaking API, or large dependency upgrade.
7. **Execute** — implement only approved/in-scope change.
8. **Test** — run focused tests and representative scenario; record changed query count and result equivalence.
9. **Review** — inspect generated SQL for complex replacements and inspect diff for unrelated changes/client-side filtering.
10. **Independent verification** — Query Verifier repeats relevant checks.
11. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Produced artifacts
`scan.json` when scanner is used, query-count evidence, test output, and an assessment matching `schemas/assessment.schema.json`.

## Retry rules
Maximum two retries for transient test/database/tool failures. Preserve command, input size, query count/log excerpt and attempt number. Deterministic failures require diagnosis/change before rerun. After two transient failures, status becomes `blocked`.

## Failure paths
No reproducible scenario → blocked with missing evidence. Result mismatch → fail. Query count increases or scales with N after change → fail. Approval-required remedy → needs-approval. Permission/environment issue → blocked.

## Stop conditions
Required context unavailable; representative reproduction impossible; dangerous change lacks approval; two repeated transient failures; optimization changes business/API contract.

## Definition of Done
Root cause is evidence-backed; baseline and changed query counts exist; result equivalence is true; focused tests pass; independent verifier completed; diff reviewed; assessment validates; required approvals exist; remaining risks are recorded; no blocking failure remains for `pass`.
