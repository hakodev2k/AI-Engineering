# Output Contract Hooks

## Hook: pre-change contract snapshot
**Trigger:** before modifying a machine-consumed producer or consumer.

**Preconditions:** contract name and baseline schema path are known.

**Action:** compute and record baseline schema SHA-256 plus producer/consumer revision identifiers in the contract record.

**Command:**
`python scripts/evaluate-contract-gate.py --mode snapshot --record <record.json> --policy config/contract-policy.json`

**Expected result:** baseline binding fields are complete and internally consistent.

**Failure behavior:** block editing workflow when an already-consumed contract has no recoverable baseline.

**Blocking:** yes.

## Hook: post-generation instance validation
**Trigger:** after any candidate output fixture or representative output is generated.

**Preconditions:** candidate schema exists.

**Action:** validate the instance shape with:
`python scripts/validate-contract-instance.py --schema <candidate-schema.json> --instance <candidate-instance.json>`

**Expected result:** exit code 0 and status `valid`.

**Failure behavior:** preserve validation errors; do not pass the instance downstream.

**Blocking:** yes.

## Hook: post-schema compatibility diff
**Trigger:** after candidate schema changes.

**Action:** run:
`python scripts/compare-contract-schemas.py --baseline <baseline.json> --candidate <candidate.json> --policy config/contract-policy.json --out <compatibility-report.json>`

**Expected result:** deterministic compatibility report with schema hashes and findings.

**Failure behavior:** block review if comparison cannot complete or files are invalid.

**Blocking:** yes.

## Hook: pre-release contract gate
**Trigger:** before merge/release/deployment of a contract-affecting change.

**Action:** run:
`python scripts/evaluate-contract-gate.py --record <record.json> --compatibility <compatibility-report.json> --review <review.json> --policy config/contract-policy.json`

**Expected result:** `verified`.

**Failure behavior:** `migration-required`, `human-approval-required`, or `blocked` prevents release until resolved.

**Blocking:** yes.