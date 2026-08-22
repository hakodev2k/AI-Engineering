# Workflow: Observe → Converge → Verify

## Trigger
Long-running task start/resume, two no-gain actions, scope expansion, repeated planning/probing, or elapsed/token ratio exceeding the task baseline.

## Goal
Reach a verified terminal state or one precise external blocker without indefinite activity loops.

## Inputs
Objective ledger, acceptance criteria, authority, baseline time/token estimate, current state, action history.

## Baseline
Capture mandatory phases, current verified phase, open blockers, no-gain ratio, repeated-probe count, elapsed/baseline ratio, and original-bug reproduction state where applicable.

## Stages
1. **Observe** — snapshot evidence and phase state.
2. **Diagnose** — select one highest-value unresolved criterion or blocker.
3. **Hypothesize** — define what evidence the next action should produce.
4. **Act** — execute one bounded action.
5. **Measure gain** — compare evidence/phase fingerprints.
6. **Re-evaluate** — if no gain twice, change strategy; if low gain persists for three cycles, checkpoint/stop.
7. **Verify** — independent verifier reconstructs state.
8. **Complete** — emit verified terminal verdict or precise blocker.

## Responsible agent
Primary agent executes; Convergence Verifier independently validates progress and final state.

## Tools
`scripts/convergence_guard.py`, git/test/build/deploy evidence, structured logs.

## Outputs
Updated ledger, before/after metrics, bounded action log, verification report.

## Checkpoints
After every action; after every compaction/resume; before any progress claim; before irreversible phase transition.

## Metrics
Evidence-gain ratio, repeated-probe count, decision reopenings, elapsed/baseline ratio, tokens per verified transition, unsupported progress claims, original-defect resolution rate.

## Retry policy
No more than two equivalent attempts. After two no-gain attempts, a different hypothesis is mandatory. Maximum three low-gain cycles before stop/escalation.

## Stop conditions
All terminal criteria verified; precise external blocker; authority boundary; three low-gain cycles; verifier BLOCK requiring human judgment.

## Failure path
Checkpoint objective/authority/evidence/provenance, state the exact missing condition, and stop autonomous continuation. Do not hide failure with narration or weaker verification.

## Verification
Verifier compares ledger claims with independently read evidence and runs the deterministic guard.

## Definition of Done
Terminal objective preserved; no mandatory criterion omitted; progress claims backed by evidence; loop bounded; decisions stable; before/after metrics captured; final state independently verified.