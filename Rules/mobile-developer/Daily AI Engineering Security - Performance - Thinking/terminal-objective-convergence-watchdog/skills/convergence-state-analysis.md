# Skill: Convergence State Analysis

## Purpose
Keep a long-running agent aligned to a finite terminal objective and detect activity that does not change verified task state.

## Trigger
Task start, context compaction/resume, completion-phase transition, repeated tool family, elapsed/token overrun threshold, or two consecutive actions with no evidence gain.

## Inputs
Terminal objective, authorized phases, acceptance criteria, settled decisions, blockers, current repository/runtime state, recent action records, time/token counters.

## Preconditions
The objective and acceptance criteria can be expressed as observable states without requesting hidden chain-of-thought.

## Required context
Facts, assumptions, evidence references, decision ledger, phase state, named uncertainties, unresolved blockers, last five action outcomes.

## Allowed tools
Read-only state inspection, test/build/deployment status, git status/diff, structured logs, deterministic state ledger.

## Constraints
Do not expose hidden reasoning. Record only concise hypotheses, evidence, assumptions, decisions, and verification status. Never invent progress to satisfy a deadline.

## Procedure
1. Normalize the terminal objective into ordered or partially ordered observable phases.
2. Mark each phase `not-started`, `active`, `blocked`, or `verified` with evidence.
3. Persist settled user decisions with an evidence/version key; reopen only when new contradictory evidence is recorded.
4. Before a tool action, record the named uncertainty or criterion it is expected to resolve.
5. After the action, compare evidence and phase-state fingerprints.
6. Classify gain as `decisive`, `partial`, or `none`.
7. On two consecutive `none` gains for the same blocker, force a different hypothesis/strategy.
8. On three low-gain cycles without terminal-state movement, checkpoint and stop/escalate rather than continue indefinitely.
9. Permit progress/status wording only when backed by the phase ledger.

## Decision points
- New contradictory evidence may reopen a settled decision.
- A failed probe that does not update a blocker MUST NOT justify an equivalent retry.
- External durable wait conditions become `blocked`, not autonomous continuation loops.
- Completion requires all mandatory terminal criteria to be independently verified.

## Expected output
Compact state ledger: Facts, Assumptions, Decisions, Phase, Target uncertainty, Evidence gain, Risks, Verification status, Next allowed action.

## Metrics
No-gain action ratio, repeated-probe rate, decision-reopen count, elapsed/baseline ratio, tokens per verified phase transition, unsupported progress-claim count, time to terminal verdict.

## Verification
Independent verifier reconstructs phase state from tool evidence and compares it with the ledger.

## Failure handling
One strategy reset after two no-gain actions; checkpoint/stop after the third low-gain cycle unless new evidence appears.

## Stop conditions
Terminal criteria verified; precise external blocker recorded; three bounded low-gain cycles; authority missing for irreversible action; evidence conflict requiring human review.