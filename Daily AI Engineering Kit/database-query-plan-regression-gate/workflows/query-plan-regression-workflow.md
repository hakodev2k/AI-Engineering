# Workflow: Query Plan Regression Gate

## Trigger
Run when SQL, LINQ/EF Core, query-builder, provider, index/schema, statistics-sensitive code, or parameterization may change database execution behavior.

## Entry conditions
- Stable logical `query_id` is known.
- Baseline revision and candidate revision are known.
- Representative dataset/parameter profile is defined.
- Plan capture can be performed safely.

## Inputs
Baseline/candidate source revisions, original plans, measured metrics, dataset profile, `config/query-plan-policy.json`.

## Context
Start with the query entry point, nearby data-access implementation, tests, schema/index definitions, and plan artifacts. Expand only when evidence indicates another dependency.

## Stages

### 1. Capture baseline
**Owner:** Query Plan Analyst  
Capture original plan + measured metrics and normalize to `baseline.json`.

Checkpoint: `python scripts/validate-query-plan-evidence.py baseline.json` must pass.

### 2. Capture candidate
**Owner:** Query Plan Analyst  
Capture under equivalent query identity, engine, dataset profile, and measurement assumptions.

Checkpoint: validation must pass.

### 3. Deterministic comparison
Run:

```bash
python scripts/compare-query-plans.py baseline.json candidate.json --policy config/query-plan-policy.json --output comparison.json
```

Produced artifact: `comparison.json` with fingerprint, risk, blockers/warnings, metric/operator deltas, and source revisions.

### 4. Investigate/regress
If status is `blocked` or `review-required`, execute `skills/investigate-query-plan-regression.md`.

- Code/query-only remediation may proceed within normal repository permissions.
- Production index/schema/statistics/config changes require explicit human approval before mutation.
- After any remediation, recapture candidate evidence from the new source revision; prior comparison/review is stale.

### 5. Independent review
**Owner:** Query Plan Reviewer  
Required for policy-defined high/critical risk. Reviewer checks original plans, comparability, regression signal, source revisions, and remediation evidence. Output must match `schemas/query-plan-review.schema.json` and bind the current comparison fingerprint.

### 6. Final gate
Run:

```bash
python scripts/evaluate-query-plan-gate.py comparison.json --policy config/query-plan-policy.json --review review.json --output gate.json
```

Omit `--review` only when policy does not require independent review.

## Retry rules
- Plan/tool capture transient failure: maximum 1 retry; preserve first failure evidence.
- Validation failure: 0 blind retries; fix/recapture input.
- Comparison regression: 0 blind retries; investigate/remediate/review.
- Permission failure: do not escalate privileges automatically; stop and request appropriate authorization.

## Approval points
Explicit human approval is required before production deployment, index/schema changes, destructive SQL, production statistics/config mutation, security weakening, or irreversible database changes.

## Failure paths
- Incomparable dataset/engine/query identity → stop and recapture.
- Missing baseline → blocked; do not treat as no regression.
- Original plan unavailable for high-risk review → stop with unresolved evidence gap.
- Stale review fingerprint → blocked and re-review current comparison.
- Repeated capture/tool failure after one retry → stop with preserved diagnostics.

## Stop conditions
Stop when evidence cannot be captured safely/comparably, approval is missing, blocker remains unresolved, or final gate is not `verified`.

## Definition of Done
- Baseline and candidate evidence validate.
- Original plan artifacts are preserved for material findings.
- Comparison is bound to current revisions/policy.
- Required independent review is current.
- Final gate returns `verified`.
- Functional/build tests required by the repository also pass.
- Any remaining risks are recorded.
