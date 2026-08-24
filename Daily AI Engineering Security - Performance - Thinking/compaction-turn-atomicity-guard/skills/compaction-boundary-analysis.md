# Skill — Compaction Boundary Analysis
## Purpose
Determine whether a context compaction/checkpoint rewrite can occur without losing execution facts or changing the active task semantics.
## Trigger
Before compaction implementation, after a lost/duplicate side-effect incident, or when compaction runs during tool-heavy turns.
## Inputs
Turn snapshot, tool lifecycle records, persistence/checkpoint semantics, compaction trigger logic.
## Preconditions
Tool invocations must have stable invocation ids; state-changing tools should have correlation/idempotency identifiers where supported.
## Required context
Definitions of terminal turn states, executor completion, durable persistence, and summary insertion roles.
## Allowed tools
Read-only logs, state snapshots, `scripts/check_turn_state.py`, tests.
## Constraints
Summary text is evidence of narration, not proof of an external side effect. Unknown tool outcome MUST NOT be silently converted to success or failure.
## Procedure
1. Map states: planned → issued → confirmed/failed; identify unknown transitions.
2. Locate the exact compaction trigger relative to model turn, executor, persistence, and checkpoint commit.
3. Run the state checker on safe and unsafe fixtures.
4. Record Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
5. If unresolved tools exist, reconcile them using external/durable evidence before retrying.
6. Move compaction to a verified safe boundary or introduce an explicit barrier.
7. Validate that post-compaction active goal/turn ids remain unchanged unless a real new user turn exists.
## Decision points
Unknown side effect → reconcile, never blind retry. Nonterminal turn → block compaction. Missing correlation evidence → block high-risk compaction and escalate.
## Expected output
Safe-boundary definition, failure reproduction, proposed barrier, and verification record.
## Metrics
Lost/duplicate effect incidents, blocked unsafe compactions, reconciliation success, stale-turn resumptions.
## Verification
Unsafe fixtures must be blocked and safe terminal snapshots must pass.
## Failure handling
Preserve original history/checkpoint; stop automatic compaction; require operator reconciliation for uncertain external effects.
## Stop conditions
Maximum two compaction retries; no retry while unresolved tool state remains.
