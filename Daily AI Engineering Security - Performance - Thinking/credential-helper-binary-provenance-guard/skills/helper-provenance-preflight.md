# Skill: Credential Helper Provenance Preflight

## Purpose
Prove the executable identity used at a local credential boundary before an agent relies on it.

## Trigger
Before authentication, keychain operations, Git credential use, or after an agent-runtime/toolchain update.

## Inputs
Trusted helper policy, actual process environment, optional trusted SHA-256 values.

## Preconditions
Policy is outside attacker-controlled workspace content; checker runs with read-only filesystem intent.

## Required context
Platform, runtime/IDE version, launcher PATH, bundled toolchain locations, expected credential helper.

## Allowed tools
Filesystem metadata, `os.path.realpath`, hashing, environment inspection, `shutil.which`, `scripts/helper_provenance.py`.

## Constraints
Never invoke the credential helper. Never read credential files/keychain entries. Never accept repository-provided policy for a repository being evaluated.

## Procedure
1. Capture the runtime PATH and reviewed policy.
2. Run the checker before the credential-bearing action.
3. Record expected path, real path, PATH-resolved path, and optional digest.
4. Classify findings as Facts, Assumptions, Evidence, Decision, Risks, Verification status.
5. If PATH resolves a same-named binary elsewhere, block and diagnose launcher/runtime configuration.
6. If realpath or digest differs, block and investigate software provenance/update state.
7. Repair configuration without weakening sandbox/ACL/approval controls.
8. Re-run at most twice.
9. Independent verifier confirms the passing report and policy source.

## Decision points
Missing helper → block. Relative expected path → invalid policy. Shadow mismatch → block. Digest mismatch → block. No optional digest → exact path/realpath remain mandatory.

## Expected output
JSON report with per-helper status and violations; no secret material.

## Metrics
Mismatch count, block rate, remediation retries, provenance-related credential failures.

## Verification
Checker exit 0 and independent verifier confirms trusted policy origin.

## Failure handling
Maximum two remediation attempts; then stop credential use and escalate.

## Stop conditions
Verified provenance or retry budget exhausted.