# Workflow: Agent-Generated Code Provenance Gate

## Trigger
Run for any AI-assisted task that changes tracked repository files and must be reviewed, merged, released, or handed to another agent.

## Entry conditions
- Task id and acceptance criteria exist.
- Baseline ref is known.
- Allowed scope is declared.
- Repository state is readable.

## Inputs
Task contract, baseline ref, allowed paths, current diff, evidence sources, verification commands/results.

## Stages

### 1. Capture task contract — Provenance Analyst
Create requirement ids, allowed scope, implementation owner, and expected verification obligations.

**Checkpoint:** no implementation provenance can be approved without a baseline and scope.

### 2. Build diff manifest — deterministic
Run:

`python scripts/build-diff-manifest.py --repo . --baseline <ref> --output artifacts/diff-manifest.json`

The manifest records changed paths, status, additions/deletions where available, and a SHA-256 of the normalized diff.

### 3. Map provenance — Provenance Analyst
Populate `templates/provenance-record.json` with each changed path, rationale, requirement/evidence ids, risk tags, and verification checks.

### 4. Structural validation — deterministic
Run:

`python scripts/validate-provenance.py --record artifacts/provenance-record.json --diff artifacts/diff-manifest.json --policy config/provenance-policy.json`

**Failure path:** missing mappings, scope violations, invalid states, or missing verification obligations block review.

### 5. Execute verification
Run task-specific tests/build/static analysis. Preserve first failure evidence. Verification reruns are limited to 2 and only after an identified transient/environment correction.

### 6. Independent review — Provenance Reviewer
Recompute the diff and challenge mapping, scope, evidence, risk, and verification results. Record decision in the provenance record.

### 7. Final deterministic gate
Run:

`python scripts/evaluate-provenance-gate.py --record artifacts/provenance-record.json --diff artifacts/diff-manifest.json --policy config/provenance-policy.json`

Gate outcomes:
- `pass`
- `needs-revision`
- `human-approval-required`
- `block`

### 8. Approval boundary
Explicit human approval is required before destructive changes, production actions, database/schema changes, secret/security changes, infrastructure changes, force push/history rewrite, irreversible operations, or breaking public contracts.

### 9. Complete
Only `pass`, or an approval-required record with valid explicit human approval and a re-run gate, may be reported as verified.

## Produced artifacts
- `artifacts/diff-manifest.json`
- `artifacts/provenance-record.json`
- Build/test/static-analysis evidence referenced from the record.

## Retry rules
- Diff/validation tool transient failure: maximum 1 retry after preserving the first error.
- Verification failure: maximum 2 reruns, only after a specific corrective action.
- Review revisions: maximum 2 cycles. After that, stop and escalate.
- Never retry policy, permission, scope, or approval failures automatically.

## Stop conditions
Stop when baseline is invalid, scope is ambiguous, evidence is missing, a material change is unexplained, required verification cannot run, reviewer independence is violated, or approval is required but absent.

## Definition of Done
- Diff manifest matches current repository state.
- Every material change is mapped to evidence/requirements.
- No unacknowledged out-of-scope change exists.
- Verification results are recorded and successful where required.
- Independent review is complete for high-risk work.
- Required human approvals exist.
- Final gate returns `pass`.
- Remaining non-blocking risks are documented.