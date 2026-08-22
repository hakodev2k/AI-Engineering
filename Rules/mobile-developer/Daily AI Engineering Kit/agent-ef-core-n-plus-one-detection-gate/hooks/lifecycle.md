# Lifecycle Hooks

## Pre-task validation
**Trigger:** before investigation. **Preconditions:** repository and input log exist. **Action:** validate `config/policy.yaml` and run package tests. **Command:** `python -m unittest tests/test_detect_n_plus_one.py`. **Expected result:** exit 0. **Failure:** block execution and preserve output.

## Post-capture detection
**Trigger:** after EF command log capture. **Preconditions:** log contains the configured command marker. **Action:** run detector. **Command:** `python scripts/detect_n_plus_one.py --log <log> --policy config/policy.yaml --out <result.json>`. **Expected result:** exit 0 means gate passes; exit 2 means suspects detected and investigation continues; exit 3 is tooling failure. **Failure:** exit 3 blocks execution.

## Post-edit verification
**Trigger:** after remediation edits. **Preconditions:** functional scenario can run. **Action:** build/test, recapture the same scenario, then rerun detector. **Expected result:** functional checks pass and original suspect group is absent. **Failure:** consume one of at most two remediation retries.

## Final package verification
**Trigger:** before publishing this kit. **Action:** `python scripts/verify_package.py`. **Expected result:** all manifest files exist, are non-empty, are referenced by README, and contain no omission markers. **Failure:** blocks completion.
