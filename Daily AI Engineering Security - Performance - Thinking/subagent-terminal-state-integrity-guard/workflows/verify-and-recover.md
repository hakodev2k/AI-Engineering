# Workflow — Verify and Recover Delegated Work

## Trigger
A child agent/task reports a terminal state.

## Goal
Accept only evidence-backed completion and recover incomplete work without unbounded retries or unsafe side-effect replay.

## Inputs
Child state JSON, task contract, deliverable contract, tool ledger, optional artifact paths.

## Baseline
Before enabling the gate, sample at least 20 child completions or all available runs if fewer. Record lifecycle-success count, missing/unmatched tool results, missing deliverables, reruns, and parent rework.

## Context
Use the smallest evidence set sufficient for validation.

## Stages
1. **Observe** — capture raw status, terminal reason, output, tool ledger, and expected deliverables.
2. **Measure baseline** — compute unresolved tool calls and deliverable checks.
3. **Diagnose** — run `scripts/validate_terminal_state.py` and classify evidence conflicts.
4. **Form hypothesis** — identify one likely residual cause: deferred tool, context/usage cutoff, missing artifact, truncated output, explicit failure, or unknown.
5. **Plan recovery** — create a residual task that preserves completed evidence. Establish side-effect idempotency before any replay.
6. **Implement recovery** — retry only missing work; maximum two automated attempts.
7. **Measure again** — re-run the same validator and artifact checks.
8. **Improved?** If no, stop after the second failed recovery and escalate. If yes, continue.
9. **Verify** — Terminal-State Verifier independently checks acceptance evidence.
10. **Complete** — parent may consume output only after `accepted`.

## Responsible agent
Parent orchestrator owns recovery; `subagents/terminal-state-verifier.md` owns independent acceptance.

## Tools
Validator script, read-only file/transcript inspection, declared non-destructive verification commands.

## Outputs
Normalized acceptance record, residual task if needed, verification evidence.

## Checkpoints
- CP1 raw terminal state persisted.
- CP2 tool-call reconciliation complete.
- CP3 deliverables verified.
- CP4 retry safety established.
- CP5 independent verification complete.

## Metrics
False-completion acceptance rate, unmatched tool-call rate, deliverable verification coverage, retries per task, recovered-work reuse, wasted tokens/time.

## Retry policy
Maximum two automated recovery attempts. Retry must target the residual only. Side effects require idempotency evidence or human approval.

## Stop conditions
Accepted and verified; explicit non-retryable failure; unsafe/ambiguous side effect; or two unsuccessful recovery attempts.

## Failure path
Return `needs_review` with preserved evidence. Never relabel failure as success and never loosen acceptance rules.

## Verification
Run unit fixtures plus at least one real valid completion and one deliberately truncated/deferred fixture.

## Definition of Done
Evidence documented; baseline captured; validator implemented; incomplete fixtures rejected; valid fixture accepted; recovery bounded; high-impact output independently verified; no blocking ambiguity remains.