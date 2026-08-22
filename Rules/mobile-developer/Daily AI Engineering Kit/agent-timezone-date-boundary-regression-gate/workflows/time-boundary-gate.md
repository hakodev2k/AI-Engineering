# Timezone & Date Boundary Regression Gate Workflow

## Trigger
A change to scheduling, expiry, billing/reporting periods, date filters, calendar handling, serialization, or storage of temporal values; or a production defect near date/time boundaries.

## Entry conditions
Target flow is known and non-destructive inspection/testing is permitted.

## Inputs
Relevant code, temporal contracts, business timezone, storage representation, representative timestamps, tests/logs.

## Stages
1. **Context** — Time Investigator classifies temporal values and traces creation → conversion → storage → comparison/grouping → output.
2. **Static scan** — run `python3 scripts/scan-time-risks.py <repo> --output scan.json`; review exit-1 findings as hypotheses.
3. **Semantics checkpoint** — establish authoritative timezone and range conventions; unresolved business semantics blocks implementation.
4. **Boundary plan** — define cases for day/month/year boundaries and DST transition behavior where applicable.
5. **Approval checkpoint** — stop before schema changes, production config/deployment, data rewrites, or breaking API changes.
6. **Execute** — make the smallest safe in-scope correction.
7. **Focused tests** — test UTC, Asia/Ho_Chi_Minh, and a DST-observing zone; verify representative round trips and range edges.
8. **Build/review** — run repository checks and inspect diff for unrelated temporal changes.
9. **Independent verification** — Verification Agent reruns relevant cases and challenges assumptions.
10. **Assessment validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Temporal semantic type known; business timezone explicit; canonical storage semantics known; range inclusivity explicit; all relevant conversion points identified.

## Retry rules
Maximum two retries for transient test/tool/environment failures. Preserve timestamp, zone ID, command, output, and attempt number. Deterministic failures require diagnosis or a code/config change before rerun.

## Failure paths
Unknown business timezone or contract → `blocked`. Required dangerous change without approval → `needs-approval`. Reproducible boundary failure → `fail`. Environment/permission problem after two transient attempts → `blocked` with evidence.

## Stop conditions
Missing authoritative semantics, approval boundary reached, two repeated transient failures, or independent verification finds an unresolved boundary regression.

## Produced artifacts
Optional `scan.json` plus an assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Target temporal semantics are documented; required zones and boundaries tested; round trips verified; scanner findings reviewed; build/focused tests pass; independent verification completes; assessment validates; approvals exist where needed; remaining risks are explicit; no blocking failure remains for `pass`.
