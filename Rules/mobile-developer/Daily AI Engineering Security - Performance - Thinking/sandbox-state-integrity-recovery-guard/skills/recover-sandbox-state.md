# Skill — Recover Sandbox State Safely

## Purpose
Diagnose and recover rebuildable sandbox state corruption without weakening the configured security boundary.

## Trigger
Sandbox initialization fails with parse/integrity/version errors, privileged setup repeats unexpectedly, or multiple runtimes appear to invalidate shared sandbox state.

## Inputs
State path, state classification, expected schema version/runtime owner, failure log, and a known-safe boundary probe.

## Preconditions
Back up/quarantine evidence before mutation. Know whether the file is rebuildable cache or authoritative policy. If classification is unknown, stop for human review.

## Allowed tools
Read-only filesystem inspection, hashing, JSON parsing, process/runtime version inspection, package-provided guard, and approved sandbox setup/rebuild command.

## Constraints
- MUST NOT disable sandboxing to make the task pass.
- MUST NOT delete evidence before preserving hash/path/timestamp.
- MUST NOT auto-rebuild authoritative policy state.
- MUST require post-recovery boundary verification.

## Procedure
1. Capture exact error, path, size, mtime, SHA-256, runtime version, and schema expectations.
2. Run `scripts/sandbox_state_guard.py inspect`.
3. Classify result: valid, corrupt rebuildable, incompatible, or review-required.
4. For corrupt rebuildable state, quarantine with atomic rename; never overwrite the original.
5. Run the product-supported rebuild/setup once.
6. Re-inspect regenerated state.
7. Run a boundary probe that must demonstrate both an allowed in-scope operation and a denied out-of-scope operation.
8. Record before/after hashes, setup attempts, and verification result.

## Decision points
- Unknown state semantics → stop.
- Schema/runtime mismatch → do not migrate blindly; use an explicit compatible migration or isolated namespace.
- Recovery repeats once with identical signature → stop and escalate.
- Boundary probe fails → mark recovery failed even if setup returned success.

## Expected output
Structured incident record with diagnosis, quarantine path, rebuild result, boundary evidence, and final status.

## Metrics
Recovery success rate, unsafe fallback count, repeated setup count, time-to-diagnosis, boundary probe pass rate.

## Verification
Independent verifier checks that no policy was weakened and that the expected deny boundary still holds.

## Failure handling
Maximum one rebuild retry after new evidence. Preserve artifacts and stop if the same failure signature recurs.

## Stop conditions
Verified boundary restored; unknown/authoritative state encountered; identical failure after one recovery attempt; or human approval required for privileged/irreversible action.
