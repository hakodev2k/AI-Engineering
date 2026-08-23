# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before investigation or edits. **Preconditions:** repository and policy readable. **Action:** `python scripts/secret_zero_gate.py --root . --policy config/policy.json --environment local --output secret-zero-before.json`. **Expected:** result is captured; findings are classified before edits. **Failure:** exit 3 blocks execution; scanner findings block production migration until classified.

## Post-edit secret-zero scan
**Trigger:** after credential/config/deployment edits. **Action:** rerun the scanner with the target environment and write `secret-zero-after.json`. **Expected:** no unexplained blocking finding and no secret value in output. **Failure:** blocks verification.

## Test hook
**Trigger:** after post-edit scan. **Action:** `python -m unittest discover -s tests -v`. **Expected:** all package tests pass, followed by repository-specific auth tests. **Failure:** one evidenced fix-retest attempt; repeated failure blocks completion.

## Final verification hook
**Trigger:** before claiming success. **Action:** compare before/after findings, inspect changed files, confirm positive/negative auth evidence, approval state, and independent verifier result. **Expected:** workflow Definition of Done is satisfied. **Failure:** blocks completion; no automatic production action is allowed.
