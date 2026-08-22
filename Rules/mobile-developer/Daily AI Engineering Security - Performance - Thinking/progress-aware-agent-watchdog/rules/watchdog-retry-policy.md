# Rules: Progress-Aware Watchdog and Retry Policy

1. Every long-running agent task **MUST** have a finite hard timeout.
2. Watchdog decisions **MUST NOT** depend on a single wall-clock inactivity timestamp when richer progress signals are available.
3. The runtime **MUST** distinguish at least model-thinking, network-stream, tool-execution, build/test, and unknown phases when those phases are observable.
4. Each phase **MUST** use an explicit patience budget from policy.
5. Transport activity **MUST NOT** be treated as proof of useful task progress.
6. Repeated identical tool calls or repeated identical failures **MUST NOT** indefinitely reset the no-progress budget.
7. Durable artifact/checkpoint/verification advancement **SHOULD** carry more weight than stream chatter.
8. Before retrying an expensive attempt, the runtime **MUST** record the latest verified checkpoint when one exists.
9. A retry **MUST** resume from a verified checkpoint when safe and supported rather than repeat repository discovery or environment setup from scratch.
10. Each attempt **MUST** record a retry signature containing failure class, phase, checkpoint/progress identity, and last meaningful action.
11. The runtime **MUST** stop when identical no-progress signatures reach the configured threshold.
12. Total attempts, elapsed time, and wasted-token usage **MUST** each have independent finite budgets.
13. Raising a timeout **MUST NOT** be the only recovery mechanism when repeated evidence shows no new progress.
14. Lowering a timeout **MUST NOT** be used without regression evidence showing healthy long-running tasks still complete.
15. A tool currently executing **SHOULD** use tool-specific patience and cancellation semantics where available.
16. A watchdog kill **MUST** preserve diagnostic evidence and resumable state before destructive cleanup when feasible.
17. The implementing agent **MUST NOT** declare a performance improvement without before/after measurements of false-positive kills, recovery latency, and wasted tokens.
18. Human escalation **MUST** occur when progress cannot be safely classified and all bounded recovery options are exhausted.