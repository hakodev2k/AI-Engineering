# Workflow: Observe → Recover → Verify

## Trigger
An agent exceeds the normal task duration, repeats actions, approaches a budget, or produces no new durable artifact/verification evidence.

## Goal
Stop no-progress loops early without terminating productive long-running work.

## Inputs
Trace JSONL, `config/policy.json`, task acceptance criteria, current artifact/state fingerprints.

## Baseline
Capture the last verified checkpoint, current token/time/step budget, and current progress fingerprints before changing behavior.

## Stages
1. **Observe** — collect the last relevant trace window and durable-state fingerprints.
2. **Measure baseline** — identify the last step that changed artifact, verification, or external-state evidence.
3. **Diagnose** — run `scripts/progress_guard.py` and classify repetition.
4. **Form hypothesis** — state one evidence-backed reason for the stall.
5. **Recover** — change one control variable: decomposition, evidence source, tool choice, or checkpoint target.
6. **Measure again** — rerun the guard and verify whether new evidence appeared.
7. **Improved?** If no, repeat stages 4–6 at most once more. If yes, continue.
8. **Verify** — `subagents/verification-agent.md` independently confirms progress or completion.

## Responsible agent
Runtime/implementation agent performs stages 1–7; Progress Verification Agent performs stage 8.

## Tools
Trace collector, hash/diff utilities, test runner, progress guard.

## Outputs
Guard JSON, updated checkpoint, recovery record, independent verification decision.

## Checkpoints
Before recovery; after each recovery attempt; before completion.

## Metrics
No-progress streak, steps/tokens after last progress, recovery count, verified progress delta, false-positive rate.

## Retry policy
Maximum 2 recovery attempts.

## Stop conditions
Verified completion; guard stop; hard budget reached; missing critical evidence; or two failed recovery attempts.

## Failure path
Persist partial work and evidence, mark the run incomplete, and escalate with the last verified checkpoint and stop reason.

## Verification
Independent verification is mandatory after recovery and before declaring completion.

## Definition of Done
Observable progress resumed and is independently verified, or the run stopped with a durable checkpoint and machine-readable reason without weakening acceptance criteria.
