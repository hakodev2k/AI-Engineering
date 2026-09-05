# Compaction Postcondition Rules

1. Every compaction **MUST** record active-context tokens before and after the operation when those metrics are available.
2. A compaction **MUST NOT** be classified effective solely because summarization/rotation completed without exception.
3. Reclaimed tokens and reclaim ratio **MUST** be calculated from comparable active-context measurements.
4. Cumulative model/tool usage **MUST NOT** be substituted for current active-context size.
5. An ineffective compaction **MUST** trigger a bounded recovery path before another automatic compaction.
6. The system **MUST NOT** run unbounded back-to-back compactions.
7. A next-turn context rebound **MUST** be explained by actual new/injected content or classified as a monitoring-state anomaly.
8. Static/bootstrap context **SHOULD** be measured separately from reclaimable history.
9. Token optimization **MUST NOT** discard required user, security, task or verification context.
10. Before/after claims **MUST** include tokens/task or compactions/task and task-quality evidence.
11. Unknown context capacity/accounting semantics **MUST** block automatic threshold tuning.
12. An independent verifier **MUST** review changes that alter retention or destructive fallback behavior.