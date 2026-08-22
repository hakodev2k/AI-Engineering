# Lifecycle Hooks

## Post-build manifest generation
Trigger: successful deterministic build before artifacts leave the build stage.
Preconditions: trusted checkout, expected commit known, artifact roots populated.
Action: `python scripts/provenance_gate.py --write-manifest --expected-commit "$BUILD_COMMIT_SHA"`.
Expected result: exit 0 plus `artifact-manifest.json` and `provenance-result.json`.
Failure: block artifact promotion and preserve logs/result. Blocking: yes.

## Pre-release provenance verification
Trigger: before signing, publishing, or deploying release artifacts.
Preconditions: original manifest is present and artifacts are restored without modification.
Action: `python scripts/provenance_gate.py --expected-commit "$BUILD_COMMIT_SHA"`.
Expected result: exit 0 and status `verified`.
Failure: exit 2 blocks; exit 3 stops for human approval; exit 1 is tool/environment failure and may be retried at most twice. Blocking: yes.

## Package self-check
Trigger: after editing this kit.
Preconditions: Python and pytest available.
Action: `python scripts/verify_package.py`.
Expected result: required paths exist, references resolve, and tests pass.
Failure: package must not be reported complete. Blocking: yes.
