# Lifecycle Hooks

## Pre-task validation

**Trigger:** before triaging a finding.

**Preconditions:** repository path and base revision are known.

**Action:** run:

```bash
python3 scripts/check-review-diff.py --repo "$REPO" --base "$BASE" --output /tmp/review-diff.json
```

**Expected result:** exit code 0 and a JSON artifact listing changed files.

**Failure behavior:** block triage if the repository or base cannot be resolved. Do not guess the diff.

## Post-edit verification

**Trigger:** after remediation edits.

**Preconditions:** a confirmed finding and repository-native verification commands exist.

**Action:** re-run the decisive reproduction plus relevant repository tests/build/static analysis, then inspect the diff.

**Expected result:** original defect no longer reproduces and relevant regression checks pass.

**Failure behavior:** preserve output and return to the Implementation Agent within the two-retry budget. Failure blocks completion.

## Final finding validation

**Trigger:** before a merge-blocking decision or workflow completion.

**Action:** run:

```bash
python3 scripts/validate-findings.py --input "$FINDINGS" --policy config/triage-policy.json
```

**Expected result:** exit code 0.

**Failure behavior:** block completion. Fix the evidence record or re-open triage; never suppress the validator.
