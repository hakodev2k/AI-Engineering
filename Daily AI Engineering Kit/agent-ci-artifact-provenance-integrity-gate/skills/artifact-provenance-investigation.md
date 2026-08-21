# Artifact Provenance Investigation

## Purpose
Determine whether CI-produced binaries/packages can be traced to the intended source commit and whether they changed after build.

## When to use
Use before release publication, after a suspicious CI artifact mismatch, when reproducing a release, or when an agent prepares artifacts for human approval.

## Inputs
- Repository checkout
- Expected commit SHA when supplied by CI
- Configured artifact directories
- Existing `artifact-manifest.json` when verifying
- CI logs/build command when root-cause analysis is needed

## Preconditions
- Git metadata is available.
- Build artifacts already exist for verification, or the workflow is in manifest-generation mode.
- Python 3.9+ is available for the deterministic gate.

## Allowed tools
Read-only repository inspection, Git read commands, local hashing, build/test logs, and `scripts/provenance_gate.py`.

## Constraints
Do not publish, sign, delete, replace, or deploy artifacts. Do not edit the policy to suppress a finding.

## Procedure
1. Read `config/policy.yaml` and identify artifact roots, ignored patterns, and release signature requirements.
2. Resolve `git rev-parse HEAD` and record the CI-provided expected commit if present.
3. Locate artifact-producing build steps and confirm the artifact roots correspond to actual outputs.
4. Run `python scripts/provenance_gate.py --write-manifest --expected-commit <sha>` only in the generation stage immediately after a trusted build.
5. In verification stages, run `python scripts/provenance_gate.py --expected-commit <sha>` without `--write-manifest`.
6. Classify findings as facts. Keep hypotheses about causes separate until validated by logs, timestamps, or reproducible builds.
7. For `COMMIT_MISMATCH`, inspect checkout/ref resolution before rebuilding.
8. For `ARTIFACT_HASH_MISMATCH`, preserve the original manifest and suspect artifact; compare build logs and reproduce in a clean environment.
9. For `UNTRACKED_ARTIFACT`, determine which build step created it and whether it belongs in a configured root.
10. For `ARTIFACT_MISSING`, verify packaging/filtering steps and build conditions.
11. If a release requires signing and the signature is not verified, hand off for human approval rather than bypassing the policy.

## Expected output
A `provenance-result.json` containing status, commit, artifact hashes/sizes, and evidence-backed findings.

## Verification
The investigation is complete only when the result status is `verified`, or when a blocking/approval finding is explicitly handed off with preserved evidence.

## Failure handling
Retry a failed read-only tool invocation at most twice when the failure is transient. Do not retry deterministic hash mismatches without changing the underlying evidence or performing an approved rebuild.

## Stop conditions
Stop on permission failure, commit mismatch that cannot be explained, artifact tampering, invalid manifest, or approval-required release signing.
