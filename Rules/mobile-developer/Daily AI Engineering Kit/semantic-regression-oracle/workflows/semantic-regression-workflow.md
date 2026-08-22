# Workflow: Semantic Regression Oracle

## Trigger
Run when a change may alter externally observable or business-significant behavior even if normal tests are expected to remain green.

## Entry conditions
- Baseline ref/environment is identified.
- Candidate ref/environment is identified.
- A scenario suite exists or can be derived from evidence.

## Flow
```text
Trigger
  ↓
Scenario Analyst: discover behavior + invariants
  ↓
Validate scenario suite
  ↓
Capture/validate baseline
  ↓
Replay candidate
  ↓
Deterministic semantic comparison
  ↓
Semantic Reviewer
  ↓
[compatible] ───────────────→ final gate
[allowed change] ───────────→ evidence/approval check → final gate
[ambiguous/high-risk] ──────→ human approval or blocked
  ↓
Verified
```

## Inputs
Scenario suite, baseline results, candidate results, requirement/change evidence, policy.

## Produced artifacts
- Scenario suite JSON
- Baseline result JSON
- Candidate result JSON
- Semantic diff report JSON
- Reviewer decision

## Checkpoints
1. Suite validates before execution.
2. Baseline and candidate reference the same suite hash.
3. Comparator completes without input mismatch.
4. Reviewer is not the implementing agent for critical changes.
5. Final gate has no unapproved critical differences.

## Retry rules
- One retry maximum for transient scenario execution/tool failures.
- No retry for deterministic schema/comparison failures until inputs are corrected.
- Preserve first failure output and timestamps.
- Repeated transient failure stops as `blocked-environment`.

## Approval points
Explicit human approval is required before accepting changes to authorization/security semantics, billing/financial calculations, destructive behavior, breaking public behavior, or policy-designated critical invariants.

## Failure paths
- Missing baseline → `blocked-missing-baseline`
- Suite mismatch → `blocked-suite-mismatch`
- Invariant violation → `blocked-regression`
- Ambiguous business intent → `human-approval-required`
- Repeated environment failure → `blocked-environment`

## Definition of Done
- Suite and results validate.
- All critical scenarios executed.
- Deterministic comparison completed.
- Reviewer decision recorded.
- Required approvals exist.
- Final gate returns `verified`.
- Remaining non-blocking differences are documented.