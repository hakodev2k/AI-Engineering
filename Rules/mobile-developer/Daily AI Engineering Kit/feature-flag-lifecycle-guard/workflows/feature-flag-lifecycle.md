# Workflow: Feature Flag Lifecycle

## Trigger
A flag is introduced, materially changed, audited, expired, or proposed for retirement.

## Entry conditions
- Repository is accessible.
- Policy is available.
- The flag key or proposed behavior is identifiable.

## Inputs
- change/audit request,
- repository root,
- lifecycle records,
- rollout evidence when applicable,
- project build/test commands.

## Context
Inspect flag definition and evaluation points, related tests, configuration registration, deployment/rollout metadata, and affected data/API/security behavior.

## Stages

### 1. Context gathering — Flag Lifecycle Analyst
Produce a lifecycle assessment and reference inventory.

Checkpoint: facts, hypotheses, owner, state, expiry, and flag type are explicit.

### 2. Policy validation — deterministic
Run:
```bash
python scripts/validate-feature-flags.py --records .feature-flags/flags.json --policy config/feature-flag-policy.json
```
Exit code must be 0 to continue.

### 3. Reference scan — deterministic
Run:
```bash
python scripts/scan-flag-references.py --root . --records .feature-flags/flags.json --policy config/feature-flag-policy.json --output .feature-flags/reference-report.json
```
Preserve the report as evidence.

### 4A. Introduction/change path
Analyst verifies fallback behavior, rollout criteria, cleanup trigger, expiry, and tests. Host implementation agent performs scoped edits. Run relevant build/tests and rerun deterministic checks.

### 4B. Retirement path
Analyst identifies permanent branch and writes a retirement plan. If protected/high risk, stop for human approval before removal. Host implementation agent removes obsolete branch/registration and preserves regression coverage.

### 5. Post-change scan and tests
Run validator, scanner, and relevant repository tests/build. Explain every remaining reference.

### 6. Independent review — Flag Retirement Reviewer
For retirement, reviewer returns `pass`, `revise`, or `blocked`.

### 7. Revision loop
`revise` returns to the analyst/implementation stage. Maximum 2 revision cycles. Preserve prior scanner reports and test evidence. If the same blocking finding persists after 2 revisions, stop and escalate.

### 8. Verification
Confirm records validate, scanner completed, tests/build pass, approvals exist, expected files changed only, and reviewer passed where required.

### 9. Complete
Report lifecycle state as verified. `retired` is valid only after runtime references/branches are removed according to policy.

## Tools
Repository read/search/edit tools, deterministic scripts in `scripts/`, project test/build tools, read-only rollout metadata sources, and approved configuration systems.

## Produced artifacts
- lifecycle record,
- reference report,
- retirement plan when applicable,
- test/build evidence,
- reviewer decision,
- approval record when required.

## Retry rules
- Validator policy/schema failure: 0 automatic retries; revise input then rerun.
- Scanner operational/transient failure: max 1 retry.
- Implementation/test-fix loop: max 2 revisions.
- Reviewer revision loop: max 2 revisions.
- Permission failure: 0 retries that increase privilege; escalate.

## Stop conditions
- Missing owner for an active flag.
- Unknown permanent branch during retirement.
- Expired temporary flag without an explicit disposition.
- Protected retirement without human approval.
- Unresolved security/data/public-contract compatibility risk.
- Repeated test/reviewer failure after bounded revisions.
- Scanner cannot reliably complete.

## Approval points
Human approval is required before removing kill switches/protected operational flags, changing production rollout state, deleting security/billing/data-integrity branches, or converting temporary flags into permanent operational controls.

## Failure paths
Transient tool failure preserves evidence and retries once. Validation or business-rule failure returns for revision. Permission failure stops. Unknown behavior or conflicting evidence becomes `blocked` rather than guessed.

## Definition of Done
- Required lifecycle metadata is valid.
- Deterministic validation/scanning succeeded.
- Code/config state matches lifecycle state.
- Relevant build/tests pass.
- No unexplained stale references remain.
- Independent retirement review passes when applicable.
- Required approvals exist.
- No blocking risk remains.