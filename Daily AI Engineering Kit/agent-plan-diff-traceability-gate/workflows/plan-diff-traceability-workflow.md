# Workflow: Plan-to-Diff Traceability Gate

## Trigger
Run when an AI-assisted implementation is about to begin, after material scope changes, before PR preparation, and before claiming the task verified.

## Entry conditions
- Repository and base revision are known.
- A structured plan exists.
- The implementing actor is identified.

## Inputs
`plan.json`, repository base/head revisions, actual diff, policy, test/build/contract evidence, and optional approval/review records.

## Context
Read plan first, then affected modules/tests. Expand repository context only when a change cannot be mapped or verified.

## Flow

```text
Freeze plan
  ↓
Fingerprint plan
  ↓
Implement within allowed paths
  ↓
Collect actual diff
  ↓
Build change manifest
  ↓
Deterministic traceability validation
  ├─ blocked → replan/remediate → validate again
  ├─ review-required → independent review
  └─ verified → final gate
                     ↓
            approval boundary check
                     ↓
              final verification
```

## Stages

### 1. Freeze plan
**Responsible:** Planner/task owner. Define stable IDs, intent, acceptance criteria, allowed paths, risk, and approval needs. Produce `plan.json`.

### 2. Pre-edit checkpoint
**Responsible:** Change Mapper. Compute plan fingerprint. Stop if plan lacks stable scope/criteria. Do not perform dangerous actions.

### 3. Execute implementation
**Responsible:** Implementation agent. Edit only authorized scope. If genuinely new work emerges, stop and explicitly replan instead of widening scope silently.

### 4. Collect actual diff
**Responsible:** Change Mapper. Run `scripts/collect-git-diff.py <base> <head>` and inventory every add/modify/delete/rename.

### 5. Build manifest
Map every changed file to real plan item IDs and acceptance criteria, record reason/risk/approval ID, and account for every plan item.

### 6. Deterministic validation
Run `scripts/validate-traceability.py plan.json change-manifest.json config/traceability-policy.json`.

Checkpoint outcomes:
- `verified`: proceed.
- `review-required`: request review.
- `blocked`: no merge/final success; replan or remediate.

### 7. Independent review
**Responsible:** Traceability Verifier. Mandatory for high/critical risk and for validation warnings. Review must bind current plan and manifest fingerprints.

### 8. Final gate
Run `scripts/evaluate-final-gate.py plan.json change-manifest.json validation.json [traceability-review.json]`.

### 9. Complete
Only status `verified` permits the workflow to report verified completion. A successful edit/build without this gate is `executed`, not verified.

## Retry rules
- Maximum transient retries: 1.
- Retryable: temporary Git read failure, filesystem read error, transient tool/network metadata failure.
- Not retryable: scope violation, unmapped change, stale fingerprint, missing approval, failed acceptance evidence, business-rule conflict.
- Preserve the failing diff inventory, validation JSON, review findings, fingerprints, and tool error.
- After repeated transient failure, stop and escalate with evidence.

## Approval points
Stop for explicit human approval before production deployment, destructive SQL, database schema changes, deletion, force push/history rewriting, infrastructure or secret changes, production configuration changes, breaking API contracts, weakening security, irreversible migration, or large dependency upgrades.

## Failure paths
- New necessary file outside allowed paths → replan; new plan fingerprint invalidates old validation/review.
- Unmapped generated/lock/config file → map it genuinely or remove it from the actual diff; do not hide it.
- Missing approval → `approval-required` and stop.
- High-risk self-review → blocked; obtain independent review.
- Pending/blocked plan item at finalization → blocked until resolved or explicitly replanned.

## Produced artifacts
`plan.json`, diff inventory, `change-manifest.json`, validation JSON, optional `traceability-review.json`, final gate JSON, test/build/contract evidence.

## Definition of Done
- Plan fingerprint matches current plan.
- Actual diff is completely represented by the manifest.
- Every changed path maps to valid plan scope and acceptance criteria.
- Every plan item is accounted for; implemented items have evidence.
- Required approvals exist.
- Required independent review is current and fingerprint-bound.
- Final gate returns `verified`.
- No blocking failure remains.
