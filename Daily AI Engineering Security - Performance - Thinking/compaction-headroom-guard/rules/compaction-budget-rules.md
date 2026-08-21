# Compaction Budget Rules

## MUST
- Measure or conservatively estimate current context usage before large context ingestion.
- Maintain explicit compaction and recovery reserves.
- Use the smaller effective capacity when the compaction path has a lower limit than the primary model.
- Include expected next-turn/tool-output growth in the budget decision.
- Create a durable task handoff before emergency compaction/recovery.
- Re-measure after compaction and verify task-critical facts, decisions, open work, and verification state.
- Bound compaction retries and recovery loops.

## MUST NOT
- Wait for the hard context limit when projected growth will consume reserved headroom.
- Assume the primary model's context window equals the compactor's usable window.
- Retry a deterministic over-limit compaction with identical input indefinitely.
- Clear history without a recoverable task-state artifact when correctness depends on prior state.
- Drop security requirements, user constraints, unresolved risks, or verification evidence just to save tokens.

## SHOULD
- Calibrate expected growth from recent p95 tool/turn usage.
- Compact after stable milestones rather than arbitrary turns.
- Prefer summaries/retrieval for low-value history while retaining exact critical artifacts externally.
- Track compaction success and quality regression by threshold band.
