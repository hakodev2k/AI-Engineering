# Skill: Source-Scoped Hook Review

## Purpose
Review executable agent hooks while preserving both exact command identity and the source that supplied each hook.

## Trigger
Installing/updating a plugin, compatibility installer, marketplace integration, project hook, or any run reporting new/changed hook hashes.

## Inputs
Current hook declarations, source identity/version, existing provenance ledger and platform hook inventory.

## Preconditions
The reviewer can inspect exact commands without executing them. Source identity comes from installer/plugin metadata, not merely storage path.

## Allowed tools
Read-only config/plugin inspection, cryptographic hashing and `scripts/hook_provenance.py`.

## Constraints
MUST NOT execute untrusted hooks during review. MUST NOT approve unrelated pending hooks. MUST NOT persist trust-bypass flags as a workaround.

## Procedure
1. Enumerate every pending hook with event, exact command, source ID/version and storage path.
2. Separate provenance (`who supplied it`) from location (`where stored`).
3. Build a candidate ledger from exact current declarations.
4. Diff each source independently against trusted records.
5. Review changed/new commands for side effects, environment/network/file access and privilege.
6. Approve only the exact hashes for the intended source.
7. Re-run verification after installation/update.
8. Preserve unrelated source records and pending state.

## Decision points
Missing source ID blocks source-scoped approval. Command-hash change requires re-review. Source-ID change requires re-review even if command bytes match.

## Expected output
Per-source approved/pending/stale records and exact command hashes.

## Metrics
Unattributed-hook rate, global-approval events, changed hashes caught, unrelated hooks accidentally approved and review time/source.

## Verification
A source-local mutation MUST invalidate only the affected source record in deterministic tests.

## Failure handling
If provenance cannot be reconstructed, treat the hook as untrusted and require explicit human review; do not infer ownership from path alone.

## Stop conditions
Stop before execution when source is missing, command changed without review, ledger mismatch or policy forbids the source.
