# Workflow — Review, Write, Verify

## Trigger
An AI agent proposes creating/modifying configuration that may alter agent/editor/task/hook/workflow execution.

## Goal
Preserve the distinction between ordinary edit permission and permission to register future execution.

## Inputs
Target path, current bytes, proposed bytes, task requirement, approval context.

## Baseline
Record current target digest (or `absent`), current executable indicators, workspace boundary and effective edit mode.

## Context
Use `evidence/research.md`, `rules/executable-config-policy.md`, and `skills/privileged-config-review.md`.

## Stages
1. **Observe** — implementing agent records requested change and baseline.
2. **Measure** — run `config_guard.py` without approval; privileged changes must return BLOCK/10.
3. **Diagnose** — identify exact command/hook/task capability introduced or changed.
4. **Hypothesis** — state why that capability is required instead of an ordinary source/config edit.
5. **Approval checkpoint** — obtain human approval for the exact SHA-256 proposed bytes when execution capability is new or expanded.
6. **Implement** — write only the approved bytes.
7. **Measure again** — hash on-disk content and rerun guard with approved digest.
8. **Independent verify** — `subagents/security-verifier.md` checks guard, digest, tests and residual risk.
9. **Complete** — mark Implemented, Measured and Verified separately.

## Responsible agent
Implementer handles stages 1–7; Security Verifier handles stage 8. Implementer cannot self-verify.

## Tools
Static file read/diff, SHA-256, `python scripts/config_guard.py`, `python -m unittest tests/test_config_guard.py`.

## Outputs
Baseline, capability delta, approval digest, post-write digest, guard decisions, test result, independent verification status.

## Checkpoints
Before write; immediately after write; before first consumption/execution.

## Metrics
Unapproved writes blocked, stale approvals blocked, tests passing, privileged executions with verified digest, review latency.

## Retry policy
At most 2 implementation attempts. Any content change invalidates approval and restarts at the approval checkpoint.

## Stop conditions
Stop on missing approval, digest mismatch, guard error, failed test, unsupported ambiguous format, or verifier BLOCK. Never bypass the gate to make progress.

## Failure path
Preserve evidence, restore prior non-privileged state if safe, and escalate to a human owner. Do not execute the new configuration.

## Verification
All tests pass; final digest equals approved digest; verifier PASS; no secret values recorded.

## Definition of Done
Evidence documented; baseline captured; limitation understood; required change implemented; deterministic guard passes with exact approval; tests pass; independent verifier passes; risks recorded; no blocking issue remains.
