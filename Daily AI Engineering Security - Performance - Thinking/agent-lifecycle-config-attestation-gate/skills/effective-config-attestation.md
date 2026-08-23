# Skill: Effective Config Attestation

## Purpose
Prove that the runtime actor about to perform privileged work has the intended effective security configuration after lifecycle resolution.

## Trigger
Spawn, resume, fork, nested-project root change, profile switch, MCP refresh, or any transition that can change effective config.

## Inputs
- canonical declared-config JSON
- observed effective-config JSON from the real runtime actor
- actor ID and project root
- lifecycle operation
- protected dot paths

## Preconditions
The observed snapshot MUST come from runtime-effective state, not by rereading the same source config. The snapshot mechanism MUST NOT execute project-controlled commands.

## Allowed tools
Read-only config/runtime introspection, hashing, the supplied attestation script, audit logging.

## Constraints
Do not print secrets. Do not auto-relax mismatches. Do not infer equality from parent behavior. Treat missing protected fields as mismatches.

## Procedure
1. Identify the lifecycle transition and actor/root identity.
2. Define the minimum protected fields required for the intended capability.
3. Capture declared canonical config and hash it.
4. Capture effective runtime config after transition and hash it.
5. Run `scripts/attest_config.py` with all protected paths.
6. If any protected field is missing or differs, block privileged work.
7. If the mismatch could be a stale snapshot, refresh once and repeat.
8. Record the result, hashes, actor, lifecycle, and mismatch paths.
9. Have an independent verifier confirm the runtime snapshot provenance for high-risk work.

## Decision points
- Exact match on all protected fields: proceed.
- Missing/mismatch: block.
- Snapshot provenance unknown: block.
- One refresh resolves a known race: proceed with refreshed evidence.

## Expected output
Machine-readable attestation report and deterministic exit status.

## Metrics
Coverage, mismatch rate, refresh rate, verification latency, false-positive rate.

## Verification
Run the supplied unit tests and at least one real transition canary for every supported lifecycle path.

## Failure handling
One fresh snapshot retry maximum. Fallback to a known-good parent/session. Escalate persistent mismatch.

## Stop conditions
Stop immediately if snapshot provenance cannot be established or any protected mismatch remains.