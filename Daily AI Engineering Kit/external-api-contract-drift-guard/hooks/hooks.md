# Hooks

## PreTask
- **Trigger:** workflow start.
- **Action:** confirm current/candidate contract paths exist and repository is readable.
- **Command:** project-specific path checks plus `python scripts/normalize-contract.py --help`.
- **Failure behavior:** stop on missing input or unavailable Python runtime.

## PreAnalysis
- **Trigger:** before semantic contract analysis.
- **Action:** normalize both contracts and generate deterministic drift report.
- **Command:** run `normalize-contract.py` twice, then `diff-contracts.py`.
- **Failure behavior:** retry normalization once for path/encoding errors; otherwise stop.

## PreImplementation
- **Trigger:** before file modification.
- **Action:** verify compatibility plan exists and approval-required items are resolved.
- **Command:** deterministic repository check or project-specific approval marker validation.
- **Failure behavior:** block edits when plan/approval evidence is missing.

## PostImplementation
- **Trigger:** after code changes.
- **Action:** run targeted contract tests and relevant regression tests.
- **Command:** repository-native commands defined by the adopter.
- **Failure behavior:** same deterministic failure may enter diagnose/fix/test loop at most twice.

## PreComplete
- **Trigger:** before declaring success.
- **Action:** regenerate drift report if contract inputs changed, inspect Git diff, run relevant tests, and invoke Compatibility Verifier.
- **Failure behavior:** any uncovered breaking item, failed test, missing approval, or verifier `not-verified/blocked` prevents completion.
