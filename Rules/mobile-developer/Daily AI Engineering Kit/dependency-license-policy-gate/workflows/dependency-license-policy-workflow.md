# Dependency License Policy Workflow

## Trigger
A task adds, upgrades, replaces, re-sources, vendors, or otherwise changes a third-party dependency.

## Entry conditions
- Base and candidate dependency state are identifiable.
- Repository distribution/use context is known.
- `config/license-policy.json` exists.

## Inputs
- Dependency manifests, lockfiles, SBOM, vendored paths, or package list.
- Candidate dependency source/version information.
- Optional approved exception record.

## Flow

```text
Trigger
  ↓
Dependency diff
  ↓
License Evidence Analyst
  ↓
Inventory validation
  ↓
Deterministic policy evaluation
  ↓
Allowed only? ── yes ──→ Final gate
  │
  no
  ↓
License Policy Reviewer
  ↓
Exception permitted? ── no ──→ BLOCK
  │
  yes
  ↓
Human approval / exact-scope exception
  ↓
Final gate
  ↓
verified | human-approval-required | blocked
```

## Stages

### 1. Dependency diff
Responsible: main agent.

Identify changed dependencies and distribution-impacting changes. Preserve base/candidate references.

Checkpoint: no changed dependency is omitted.

### 2. Evidence capture
Responsible: License Evidence Analyst.

Use `skills/dependency-license-evidence-capture.md` and create an inventory matching `schemas/license-inventory.schema.json`.

Checkpoint:
```bash
python scripts/validate-license-inventory.py --inventory <inventory.json> --policy config/license-policy.json
```

### 3. Policy evaluation
Responsible: deterministic script.

```bash
python scripts/evaluate-license-policy.py \
  --inventory <inventory.json> \
  --policy config/license-policy.json \
  --output <evaluation.json>
```

Produced artifact includes inventory fingerprint, per-package classification, exception eligibility, and preliminary gate status.

### 4. Independent review
Responsible: License Policy Reviewer.

Required when evaluation contains `restricted`, `prohibited`, `unknown`, `partial`, ambiguous expressions, or an exception path.

Reviewer must not be the evidence analyst for these cases.

### 5. Approval boundary
Explicit human approval is required before:
- Any exception permitted by policy.
- Large dependency upgrade with material license/distribution impact.
- Vendoring third-party source.
- Accepting new redistribution/source-disclosure obligations.
- Changing policy to allow a currently blocked license.

The agent stops before these actions.

### 6. Final gate
```bash
python scripts/evaluate-license-gate.py \
  --inventory <inventory.json> \
  --evaluation <evaluation.json> \
  --policy config/license-policy.json \
  [--review <review.json>] \
  [--exception <exception.json>]
```

Only `verified` permits a merge/release recommendation.

## Retry rules
- Registry/upstream metadata lookup transient failure: maximum 1 retry.
- GitHub/package-manager read-only tool transient failure: maximum 1 retry.
- Validation, provenance mismatch, policy violation, unknown license, permission failure, or business-rule failure: no automatic retry.
- Preserve failed lookup/error evidence across retry.
- After the retry budget is exhausted, stop and classify unresolved evidence as unknown.

## Failure paths
- Missing evidence → `blocked` or `human-approval-required` according to policy; never assumed allowed.
- Prohibited license → `blocked`; exception only if policy explicitly says the exact license category is exceptionable.
- Expired/mismatched exception → `blocked`.
- Inventory changed after evaluation/review → invalidate downstream artifacts and rerun from policy evaluation.
- Policy changed after review → invalidate review/gate and rerun.

## Stop conditions
- Any required artifact fails validation.
- Any prohibited dependency has no policy-permitted exact exception path.
- Required independent review is missing.
- Required human approval is missing.
- Gate is not `verified`.

## Definition of Done
- Changed dependency set is complete.
- Inventory validates.
- Exact package/version/source provenance is recorded.
- Every license is classified.
- Required independent review exists.
- Required exception/approval is exact-scope, valid, and unexpired.
- Final gate returns `verified`.
- Remaining non-blocking obligations are documented.