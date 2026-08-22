# Engineering Rules

## MUST
- MUST externalize critical task state before compaction, handoff, model switch, or risky context exhaustion.
- MUST treat `task_id` and `active_turn.id` as authoritative identity fields.
- MUST keep active goal, constraints, decisions, completed work, failed approaches, blockers, open items, and evidence references as separate typed fields.
- MUST validate capsule checksum and policy before using it as authority.
- MUST block mutating tool calls after compaction until continuity status is `valid`.
- MUST preserve failed approaches with reasons so compaction cannot silently resurrect known-bad work.
- MUST attach artifact/evidence references to completed work and accepted decisions.
- MUST distinguish historical user text from the active user turn.
- MUST use bounded recovery: maximum attempts come from policy and may not be unlimited.
- MUST fail closed when authoritative state is missing, corrupt, conflicting, or unverifiable.
- MUST checkpoint before context becomes critically full; do not rely on last-moment compaction succeeding.
- MUST record authorized goal/constraint changes in a new generation rather than mutating history silently.

## MUST NOT
- MUST NOT use a prose summary as the sole source of truth for task identity or critical constraints.
- MUST NOT request, store, or expose hidden chain-of-thought in the capsule.
- MUST NOT mark work complete without a verifiable artifact, test, or evidence reference.
- MUST NOT retry a known failed approach merely because its failure disappeared from compacted context.
- MUST NOT treat a stale historical prompt as current because it is the latest user text visible after compaction.
- MUST NOT weaken continuity checks to make a resumed session proceed.
- MUST NOT discard blockers or pending approvals during summarization.
- MUST NOT store plaintext credentials, tokens, private keys, or secret-bearing tool output in continuity state.

## SHOULD
- SHOULD keep the capsule small enough to load independently of full history.
- SHOULD use stable IDs for decisions, completed items, failed approaches, evidence, and artifacts.
- SHOULD checkpoint after verified milestones rather than every conversational turn.
- SHOULD compare structured fields deterministically before asking an LLM to interpret discrepancies.
- SHOULD track repeated-work rate, stale-turn detections, continuity mismatches, and capsule size over time.
- SHOULD independently verify high-risk recovered state before production/destructive actions.
