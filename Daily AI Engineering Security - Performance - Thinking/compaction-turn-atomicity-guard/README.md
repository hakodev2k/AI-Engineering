# Compaction Turn Atomicity Guard

**Category:** Thinking

## Problem
Automatic context compaction can corrupt reasoning state if it runs while tool calls or side effects are unresolved, or if the compaction artifact changes which turn appears active.

## Evidence
See `evidence/research.md` for current 2026 reports and implementation changes showing mid-turn compaction, lost effects, and stale-turn reactivation risks.

## Existing approach and limitation
Threshold compaction and even “idle” compaction are insufficient unless idle is defined from durable tool/turn state. Natural-language summaries cannot prove whether a side effect committed.

## Proposed improvement
Treat compaction as a guarded state transition. Require a terminal turn, zero unresolved tools, stable invocation/correlation ids, bounded retries, and post-compaction active-goal/turn identity verification.

## Architecture
- `evidence/research.md` — research and qualification.
- `config/policy.json` — terminal/resolved state contract and retry bound.
- `scripts/check_turn_state.py` — deterministic fail-closed gate.
- `tests/test_turn_state.py` — safe/unsafe regression tests.
- `skills/compaction-boundary-analysis.md` — diagnosis procedure.
- `rules/turn-atomicity.md` — enforceable invariants.
- `subagents/verification-agent.md` — independent verifier.
- `workflows/compact-safely.md` — bounded operational workflow.
- `hooks/pre-compaction.md` — pre-commit gate contract.

## Installation
Python 3.10+; no third-party packages.

## Configuration
Adapt terminal/resolved state names in `config/policy.json` to the host state machine. Keep `max_compaction_retries` finite.

## Usage
Serialize the current turn state to JSON with `turn_id`, `active_goal_id`, `turn_state`, and a `tools` array containing `invocation_id`, `correlation_id`, and `state`. Run:
`python scripts/check_turn_state.py turn-snapshot.json --policy config/policy.json --output compaction-gate.json`
Exit 0 permits compaction; exit 3 blocks it.

## Workflow
Follow `workflows/compact-safely.md`: Observe → Measure → Diagnose → Hypothesize → Implement → Measure again → independently verify.

## Metrics
Unsafe compactions blocked, unresolved tools at compaction, lost/duplicate side effects, stale-turn resumptions, reconciliation success, retries.

## Verification
Implemented means the gate is wired before compaction commit. Measured means runtime metrics exist. Verified means unsafe fixtures are blocked, safe fixtures pass, representative long sessions compact with zero unresolved tools, and active goal/turn identity is preserved.

## Safety
Unknown side effects require reconciliation, not replay. Never weaken the gate to relieve token pressure. Preserve original history if safety cannot be proven.

## Failure handling
Block compaction, retain the unmodified context/checkpoint, reconcile external state, refresh the snapshot, retry at most twice, then escalate.

## Definition of Done
Current evidence documented; baseline measured; gate and tests implemented; paths/references valid; bounded workflow enforced; independent verification complete; no unresolved tool state or identity drift remains.

## Customization
Extend tool states only if each added state has an explicit resolved/unresolved meaning. For state-changing APIs, integrate native idempotency/correlation identifiers where available.
