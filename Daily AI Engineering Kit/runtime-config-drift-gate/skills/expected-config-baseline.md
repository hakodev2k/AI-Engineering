# Skill: Expected Config Baseline

## Purpose
Build a normalized, machine-readable baseline of configuration that a deployment or runtime is expected to expose without copying secret values into evidence artifacts.

## When to use
Use before deployment, incident investigation, environment verification, configuration refactors, secret rotation, infrastructure changes, or any agent task that relies on runtime configuration matching repository intent.

## Inputs
- Repository root.
- Target environment name.
- Configuration source locations such as appsettings files, Helm values, Kubernetes manifests, Terraform outputs, Docker/Compose environment declarations, CI/CD variables metadata, or platform configuration exports.
- `config/drift-policy.json`.
- Optional explicit source precedence supplied by a human.

## Preconditions
- Target environment identity is known.
- Sources can be inspected without revealing raw secrets to untrusted tools.
- The agent can distinguish expected declarations from runtime observations.

## Required context
Read only configuration sources relevant to the selected environment. Expand scope only when a key's origin cannot be determined.

## Allowed tools
- Repository file search/read.
- Read-only deployment manifest inspection.
- Read-only configuration metadata APIs.
- `scripts/build-config-snapshot.py`.
- `scripts/validate-config-snapshot.py`.

## Constraints
- Never place raw values for secret-classified keys in snapshots.
- A secret key may record presence, source, type, and a keyed or externally produced fingerprint; if no safe fingerprint is available, record presence only.
- Do not infer a missing value from another environment.
- Do not silently change precedence to make conflicts disappear.

## Process
1. Identify target environment and expected configuration sources.
2. Record source precedence explicitly.
3. Enumerate configuration keys relevant to application behavior, connectivity, security, feature control, limits, queues, storage, logging, and integrations.
4. Classify each key as `public`, `sensitive`, or `secret` according to policy and explicit overrides.
5. Record expected type and whether the key is required.
6. For non-secret values, normalize deterministically using policy rules.
7. For secret values, never persist plaintext; use a safe externally supplied fingerprint when available or record `present=true` with `fingerprint=null`.
8. Record each key's expected source and precedence rank.
9. Run `scripts/validate-config-snapshot.py` against the baseline.
10. Preserve validation output as evidence.

## Expected output
A snapshot conforming to `schemas/config-snapshot.schema.json` with:
- environment identity;
- snapshot kind `expected`;
- source metadata;
- normalized key records;
- redaction state;
- type, required flag, source, and optional safe fingerprint;
- generation timestamp and producer.

## Verification
- Snapshot validator exits 0.
- No entry classified `secret` contains `value`.
- Every required key has a declared expected source.
- Duplicate keys have an explicit resolved precedence.

## Failure handling
- Unknown source precedence: stop and request human resolution.
- Secret exposure detected: discard generated artifact, do not log the value, and stop.
- Missing source: mark evidence incomplete and stop before drift comparison.
- Transient read failure: retry once; preserve first error.

## Stop conditions
Stop when the expected baseline is valid and complete enough for comparison, or when source ambiguity/security constraints prevent a trustworthy baseline.