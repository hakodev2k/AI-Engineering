# Verification Record

## Status model
This package distinguishes:
- **Implemented:** control/procedure exists in package artifacts.
- **Measured:** a metric or deterministic test result was collected.
- **Verified:** independent evidence demonstrates the stated condition for the tested scope.

## Implemented
- Pre-install registry existence/version lookup for npm and PyPI.
- Exact-version policy for unapproved packages.
- Default denial of non-registry sources.
- Cooldown-based human-review path for fresh releases.
- npm deprecated and PyPI all-yanked checks.
- Repository/source metadata check for unapproved packages.
- Machine-readable decision output, audit log, and meaningful exit codes.
- Separation of evidence analysis, install execution, and independent verification.
- Bounded retry and fail-closed rules.

## Deterministic tests defined
`tests/test_dependency_guard.py` covers:
1. git/non-registry npm source -> deny;
2. unpinned new npm dependency -> review;
3. explicit blocklist -> deny;
4. fresh package -> review;
5. sufficiently old package with repository metadata -> allow;
6. all-yanked PyPI release -> deny.

Run with:
`python -m unittest tests/test_dependency_guard.py`

## Security assertions
The package is considered verified for an integration only when all are demonstrated in that runtime:
- nonexistent package never reaches package-manager execution;
- direct URL/git/local path never reaches execution under default policy;
- fresh package requires an external human approval boundary;
- package-manager execution cannot bypass the hook through shell/generated-script/delegated-agent paths;
- resolved direct package/version equals approved identity;
- required post-install security/test checks pass;
- logs contain no credentials/secrets.

## Metrics
Collect per integration:
- `dependency_actions_total`
- `dependency_actions_guarded`
- `unguarded_dependency_actions` (target 0)
- `allow_count`, `review_count`, `deny_count`, `error_count`
- `nonexistent_blocked_count`
- `fresh_release_review_count`
- `resolved_identity_mismatch_count` (target 0 accepted)
- `security_verification_failure_count`
- median guard latency and registry-error rate

## Limitations
The guard intentionally does not claim malware detection. Registry existence, age, repository metadata, signatures, and provenance are trust signals, not proof that code is safe. Ecosystem-specific security scanners and human review remain necessary for high-risk dependencies. The current deterministic implementation directly supports npm registry and PyPI metadata; other ecosystems require adapters before use.

## Definition of Done
- Research evidence documented with dated/current sources.
- Policy configured for the target repository.
- Unit tests pass.
- Install-capable runtime paths enumerated and 100% deterministically gated.
- At least one allow, one review, and one deny integration fixture executed without bypass.
- Exact dependency identity verified after installation.
- Lock/integrity/hash evidence captured.
- Required signature/provenance/vulnerability/project checks executed where applicable.
- Independent verifier records `verified`.
- No blocking bypass or unresolved security failure remains.
