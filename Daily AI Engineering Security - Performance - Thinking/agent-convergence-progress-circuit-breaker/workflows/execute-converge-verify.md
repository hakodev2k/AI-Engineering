# Workflow: Execute, Converge, Verify

**Trigger:** finite multi-step task authorized for autonomous or long-running execution.  
**Goal:** close required acceptance rows without unbounded continuation or process expansion.

## Inputs
Stable acceptance rows, initial artifact state, authority boundaries, policy.

## Baseline
Record open acceptance rows, artifact fingerprint, evidence count, known blockers and active scope before implementation.

## Stages
1. **Observe** — load current durable task state.
2. **Measure baseline** — record the first ledger row.
3. **Diagnose** — select the highest-priority open acceptance row.
4. **Form hypothesis** — state the observable change expected from the next bounded action.
5. **Implement** — perform only work mapped to that acceptance row.
6. **Measure again** — update artifact fingerprint, evidence and open-row count; run convergence guard.
7. **Improved?** If no, use one recovery hypothesis; maximum two recovery attempts for the same blocker.
8. **Verify** — independent verifier checks closed rows against artifacts/tests.
9. **Complete** — finalize only with zero required open rows or an explicit blocked state with exact evidence.

## Responsible agent
Implementation agent for stages 1–7; Convergence Verifier for stage 8.

## Tools
Task ledger, repository status/diff, relevant test runner, `python scripts/convergence_guard.py --ledger <ledger.jsonl> --policy config/policy.json`.

## Outputs
Updated acceptance ledger, artifact/test evidence, guard decision, verification decision.

## Checkpoints
After each acceptance-row closure, before spawning new work, before a repeated review, and before finalization.

## Metrics
Acceptance rows closed per turn; max no-progress streak; new work per closure; repeated verification count; calls per closed row; rework rate.

## Retry policy
Maximum two recovery attempts per blocking hypothesis; maximum two review retries per acceptance row unless new invalidating evidence appears.

## Stop conditions
No-progress budget exceeded; expansion budget exceeded; missing authority; dangerous/irreversible action requiring human approval; exhausted recovery attempts.

## Failure path
Persist the checkpoint, stop autonomous continuation and escalate the exact blocking acceptance row with evidence. Do not replace failure with generic continuation text.

## Verification
Independent verifier must map each closed required row to concrete evidence.

## Definition of Done
Required acceptance rows are closed with evidence, guard passes, independent verification passes and no blocking issue remains.
