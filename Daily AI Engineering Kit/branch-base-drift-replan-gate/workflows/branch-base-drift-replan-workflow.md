# Workflow: Branch Base Drift Replan

## Trigger
- Implementation starts from a previously created plan.
- A paused/resumed task continues after target branch movement may have occurred.
- PR completion/review occurs after target branch advanced.

## Entry conditions
- Repository and target/head refs are readable.
- A plan identifier exists.
- Baseline exists or can be captured before implementation.

## Inputs
Plan, baseline record, target ref, head ref, planned paths/components/tests, assumptions, current repository state.

## Flow
```text
Capture baseline
  ↓
Implementation / pause / branch movement
  ↓
Detect drift
  ↓
No material drift ───────────────→ Final gate
  ↓ material drift
Map drift to plan assumptions
  ↓
Replan affected steps
  ↓
Independent review when required
  ↓
Final gate
  ↓
verified → resume implementation / PR completion
```

## Stages
1. **Baseline — Drift Planner**
   - Run `scripts/capture-branch-baseline.py`.
   - Validate with `scripts/validate-replan-record.py`.
2. **Drift detection — deterministic**
   - Run `scripts/evaluate-branch-drift.py` using the baseline and current refs.
   - Produce drift report.
3. **Replan — Drift Planner**
   - For `replan-required`/`review-required`, re-read affected evidence only.
   - Update plan revision and dispositions.
4. **Review — Drift Reviewer**
   - Required for policy-defined high-risk overlap or `review-required`.
   - Produce reviewer record without modifying planner artifacts.
5. **Gate — deterministic**
   - Run `scripts/evaluate-replan-gate.py`.
   - Only `verified` permits implementation continuation or PR completion.

## Produced artifacts
- Baseline/replan JSON record
- Drift report JSON
- Reviewer JSON when required
- Final gate JSON

## Checkpoints
- Baseline valid before implementation.
- Drift checked before resumed implementation.
- Drift checked again before PR completion.
- High-risk drift independently reviewed.

## Retry rules
- Transient Git/tool read failure: maximum 1 retry; preserve stderr/output.
- Validation failure: 0 automatic retries; correct record or stop.
- Replan/review disagreement: maximum 1 planner revision after explicit reviewer findings; unresolved disagreement stops.
- Permission/environment/business-rule failure: 0 automatic retries.

## Approval points
Explicit human approval is required before production deployment, destructive database action, schema/infra/secret/prod-config change, breaking API change, security weakening, irreversible migration, force push/history rewrite, or large dependency upgrade. The workflow never performs these actions to resolve branch drift.

## Failure paths
- Ref cannot resolve → `blocked`.
- Baseline missing after implementation already began → capture current evidence and mark provenance gap; independent review required.
- High-risk overlap without independent review → `blocked`.
- Current refs change after review → stale evidence; rerun drift evaluation.
- Unresolved conflict/ambiguous dependency impact → `blocked`.

## Stop conditions
Stop on `verified`, a required human approval boundary, a blocking ambiguity, exhausted retry budget, or invalid evidence.

## Definition of Done
- Current target/head/base bindings are recorded.
- Material drift since planning is enumerated.
- Every affected step/assumption has a disposition and evidence.
- Required tests are updated.
- Independent review exists when required.
- Final gate status is `verified`.
- No dangerous action was performed without approval.