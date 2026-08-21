# Backward Compatibility Workflow

## Trigger
Any change that may alter REST/OpenAPI, public .NET API, serialized payload, event, webhook, or SDK-visible contract.

## Entry conditions
- Baseline ref is known or can be resolved.
- Candidate ref/worktree is available.
- Contract policy exists.

## Stages

### 1. Scope
**Owner:** Contract Analyst  
Identify contract surfaces and affected consumers. Produce scope notes.

### 2. Baseline capture
Run `skills/capture-contract-baseline.md`. Produce baseline manifest/artifacts.

### 3. Candidate capture
Generate equivalent candidate artifacts with the same normalization rules.

### 4. Deterministic diff
Run:
```bash
python scripts/compare-contracts.py --baseline <baseline.json> --candidate <candidate.json> --output .compat/diff.json
```
Checkpoint: every diff has a stable ID/type/path.

### 5. Semantic classification
Run `skills/classify-contract-change.md`. Produce `compatibility-review.json`.

### 6. Independent review
**Owner:** Compatibility Reviewer  
Challenge classifications and verify migration/deprecation evidence.

### 7. Human approval boundary
Required before accepting any intentional breaking change, including public route/member removal, required-field addition, incompatible serialization change, or incompatible type/signature change.

### 8. Gate
Run:
```bash
python scripts/evaluate-compatibility-gate.py --diff .compat/diff.json --review .compat/review.json --policy config/compatibility-policy.json
```
Exit 0 only when compatible or explicitly approved according to policy.

### 9. Tests
Run repository build/tests plus consumer/contract tests. A green build does not override the compatibility gate.

### 10. Verification
Reviewer confirms final candidate artifacts match the code after last edit and gate is re-run.

## Retry rules
- Transient export/build/tool I/O failure: retry once.
- Deterministic validation/classification failure: no blind retry; correct evidence/input and rerun.
- Test failure: diagnose and fix with at most two fix-test cycles in this workflow; then stop with evidence.

## Failure paths
- Missing baseline → stop.
- Non-reproducible generated contract → stop and report nondeterminism.
- Breaking change without approval → blocked.
- Ambiguous consumer behavior → needs-review/blocked according to risk.
- Approval denied → stop; do not weaken policy.

## Definition of Done
- Baseline and candidate identities are recorded.
- Deterministic diff is complete.
- All differences are classified.
- Independent review is complete.
- Required human approvals exist.
- Gate exits 0 on final candidate.
- Required build/contract tests pass.
- Remaining risks are documented.
- Status is `verified`, not merely `executed`.
