# Workflow: Rebind and Verify

## Trigger
A persisted thread must move to a different execution runtime, host filesystem namespace, workspace root, shell family, or sandbox implementation.

## Goal
Rebind all structured environment-sensitive state atomically enough to preserve history while preventing stale or broadened permission boundaries.

## Inputs
Source snapshot/export, source/target descriptors, path mappings, expected project root, permission policy.

## Baseline
Capture source resume status, project association, source writable/sandbox roots, shell/runtime, and audit findings.

## Context
Use `skills/rebinding-audit.md` and `rules/rebinding-security-rules.md`.

## Stages
1. **Observe** — inventory stores and environment-sensitive fields.
2. **Measure baseline** — run `scripts/rebinding_audit.py`; retain JSON report.
3. **Diagnose** — classify malformed mappings, mixed provenance, stale derived permissions, and project-binding mismatches.
4. **Form hypothesis** — define explicit mappings and target canonical workspace identity.
5. **Checkpoint** — create recoverable backup; confirm writers are quiesced.
6. **Implement** — migration component updates only structured fields identified in the approved plan.
7. **Measure again** — export post-state and rerun deterministic audit.
8. **Independent verify** — `subagents/rebinding-verifier.md` checks permission delta and consistency.
9. **Resume preflight** — validate target cwd/root accessibility without side effects.
10. **Complete** — permit thread resume only after all blocking findings are zero.

## Responsible agent
Migration implementer performs stage 6; independent Rebinding Verifier performs stages 8-9.

## Tools
Structured export/import tooling, deterministic auditor, backup/restore mechanism, non-mutating path probes.

## Outputs
Baseline report, migration plan, backup reference, post-state report, verifier decision.

## Checkpoints
- Before any write: backup exists.
- Before commit: permission delta reviewed.
- Before resume: independent audit passes.

## Metrics
Critical findings, unmapped fields, mixed runtime references, permission expansions, resume success, rollback time.

## Retry policy
At most two plan revisions. Each revision returns to Diagnose and must reuse the original source snapshot.

## Stop conditions
Ambiguous workspace identity; unresolved critical path; unapproved permission expansion; missing backup; two failed revisions.

## Failure path
Do not resume under target runtime. Restore source snapshot when safe, or leave both states offline and escalate with reports.

## Verification
Pass only when deterministic audit returns exit 0 and independent verifier confirms no security regression.

## Definition of Done
Evidence documented; baseline captured; all required fields migrated; target state has zero blocking findings; permissions preserved or narrowed; backup retained until successful resume; verifier approves; no partial migration remains.