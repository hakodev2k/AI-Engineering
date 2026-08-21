# Skill: Trusted Plugin Provenance Preflight

## Purpose
Determine whether a privileged plugin service is safe and internally consistent to launch without weakening trust boundaries.

## Trigger
Run before a bundled or privileged plugin starts, after plugin install/update/repair, or when a trusted-code-path error occurs.

## Inputs
Plugin root, service module path, expected package version, expected hashes when available, configured trusted roots, sandbox-visible roots, required environment variables, optional native-host manifest/registry snapshot.

## Preconditions
Inputs are collected read-only. Expected package metadata comes from a trusted installation manifest or release package, not from the plugin being validated.

## Required context
OS, runtime version, plugin version, canonicalization rules, sandbox mode, trust-root source, and whether native-host integration is required.

## Allowed tools
Filesystem stat/read/hash, environment inspection, path canonicalization, registry/native-host read checks, deterministic script execution.

## Constraints
- MUST NOT add broad trust roots automatically.
- MUST NOT disable sandboxing or signature/provenance checks to make validation pass.
- MUST NOT execute the plugin service before provenance checks pass.
- SHOULD redact usernames and secrets from persisted diagnostics.

## Procedure
1. Resolve plugin root and service path to canonical absolute paths.
2. Verify the service exists, is a regular file, and remains under the expected plugin root after canonicalization.
3. Compare expected and actual plugin versions.
4. If expected hashes are available, verify the service hash.
5. Enumerate configured logical trusted roots and independently enumerate roots visible to the sandbox/trusted subprocess.
6. Require the service path to be contained by both trust views.
7. Verify required trust-related environment variables reach the child context.
8. If native-host integration is required, verify manifest existence, registry/registration pointer, host executable path, and allowed origins.
9. Produce a structured result with failure class: provenance, path containment, environment propagation, registration, or version skew.
10. Permit launch only when all required checks pass.

## Decision points
- Hash/version mismatch: block and require trusted reinstall/repair.
- Parent trust passes but sandbox trust fails: block and classify as propagation/sandbox drift.
- Native host missing while plugin state says installed: block that integration and require atomic repair.
- Unknown provenance: block privileged launch; do not infer trust from location alone.

## Expected output
Machine-readable preflight report plus a minimal human-readable diagnosis.

## Metrics
Preflight pass rate, false-positive rate on known-good plugins, time-to-diagnosis, count of broad-trust workarounds avoided, number of partial-install states detected.

## Verification
Test known-good, version-skewed, path-escaped, missing-registration, and parent/child trust-divergence fixtures. A known-good fixture must pass without expanding trust; all unsafe/inconsistent fixtures must block.

## Failure handling
Preserve evidence, classify the failed layer, provide repair guidance, and stop launch. Retry only once after an explicit repair or state change.

## Stop conditions
Validation passes; a blocking provenance/trust inconsistency is found; or one post-repair retry fails.