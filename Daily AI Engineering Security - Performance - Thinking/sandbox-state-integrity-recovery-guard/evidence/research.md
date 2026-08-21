# Research — Sandbox State Integrity Recovery Guard

## Topic
Sandbox state/cache corruption and cross-runtime incompatibility can disable the intended security boundary or push users toward unsafe workarounds.

## Category
Security

## Problem
AI coding agents increasingly persist local sandbox setup metadata. If this state is truncated, corrupt, stale, or incompatible across runtimes, sandbox initialization can fail repeatedly. The dangerous operational response is to bypass or disable the sandbox to keep working. Recovery therefore needs to distinguish rebuildable cache/state from authoritative policy and restore a verified boundary without silently weakening protections.

## Why it matters now
On 2026-08-19, OpenAI Codex issue #39453 reported that an interrupted write left `deny_read_acl_state.json` as NUL bytes; every sandboxed operation then failed for days until the file was renamed and rebuilt. On 2026-08-04, issue #36865 reported Desktop and npm CLI alternately invalidating a shared elevated-sandbox marker and repeatedly re-running privileged setup/UAC operations.

## Affected users
Developers using local AI coding sandboxes, Windows Codex users, teams running multiple agent clients against shared user state, and platform builders persisting sandbox/permission metadata.

## Current public evidence
### Observed evidence
1. OpenAI Codex #39453: a malformed `deny_read_acl_state.json` caused persistent sandbox setup failure across restarts, updates, and reboots. Renaming the state aside allowed regeneration and immediately restored operation. https://github.com/openai/codex/issues/39453
2. OpenAI Codex #36865: Desktop and standalone CLI used a shared sandbox marker but treated each other's marker state as incompatible, causing repeated privileged setup/UAC cycles. The report suggests namespacing, migration, atomic writes, and cross-process serialization. https://github.com/openai/codex/issues/36865
3. OpenAI Codex #37187 (2026-08-06) reported interrupted tasks leaving a broken sandbox identity/mapping with access-denied failures and repeated approval prompts, showing that sandbox lifecycle state can remain inconsistent after interruption. https://github.com/openai/codex/issues/37187

### Interpretation
The recurring engineering weakness is not merely “a bad JSON file”; it is a trust-boundary state machine that lacks durable integrity metadata, atomic persistence, version/owner compatibility checks, and fail-closed but recoverable transitions. Recovery must never equate “sandbox broken” with “run unsandboxed”.

### Proposed solution
Add a deterministic state guard that validates JSON syntax, expected schema version/owner, file integrity metadata, and optional lock ownership before sandbox startup. Invalid rebuildable state is quarantined rather than overwritten in place. Rebuild is allowed only through an explicit recovery workflow, followed by a boundary probe proving expected restrictions still hold. Unknown or authoritative policy state blocks execution and requires human review.

## Existing approaches
- Restart/update/reboot.
- Delete or rename corrupt cache files manually.
- Re-run elevated setup.
- Fall back to a less restrictive sandbox mode.

## Remaining limitations
- Generic restart/update does not repair persisted corrupt state.
- Manual deletion loses forensic evidence.
- Cross-runtime writers can race or downgrade/overwrite schema state.
- Unsandboxed fallback restores productivity by weakening security.
- Successful setup does not by itself prove effective restrictions.

## Root-cause analysis
1. Non-atomic or interruption-sensitive state persistence.
2. Missing content-integrity envelope around mutable cache/state.
3. Shared state without runtime/schema ownership discipline.
4. Recovery path coupled to privileged setup but not post-recovery boundary verification.
5. Error messages can point at downstream ACL operations instead of the state parse failure.

## Improvement opportunity
A reusable state envelope and guard can validate before use, quarantine corruption, serialize recovery, preserve evidence, and require post-rebuild security verification. This complements boundary probing; it addresses persistence/recovery integrity rather than the effective permission model itself.

## Goal
Recover from corrupted/incompatible rebuildable sandbox state without disabling the sandbox or silently accepting unknown state.

## Metrics
- corrupt-state detection rate;
- unsafe fallback count (target 0);
- successful recoveries without manual deletion;
- repeated privileged setup count;
- cross-runtime incompatibility detections;
- post-recovery boundary-test pass rate;
- mean time to actionable diagnosis.

## Trigger
Before sandbox startup, after a sandbox setup parse/integrity error, after runtime/schema upgrade, or after interrupted sandbox setup.

## Inputs
State file path, expected schema version, runtime owner, optional expected SHA-256, state classification (`rebuildable-cache` or `authoritative`), and boundary verification command.

## Outputs
`valid`, `quarantine-and-rebuild`, `incompatible`, or `block-review`, plus structured evidence.

## Status
**Implemented:** guard script, rules, recovery workflow, verifier instructions, hook, tests.

**Measured:** only after adoption telemetry/incident replay.

**Verified:** only after deterministic tests and a real boundary probe confirm recovery preserves restrictions.
