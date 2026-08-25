# Rules — Async Checkpoint Concurrency

1. A performance change MUST have a reproducible baseline before implementation.
2. A shared saver lock MUST NOT remain held across an async history `yield` when consumer pacing is outside the database consistency requirement.
3. Any intentional yield-under-lock MUST be explicitly documented with a correctness reason and a measured bounded hold-time budget.
4. Writer wait MUST be measured separately from total checkpoint latency.
5. Database-lock errors MUST be counted separately from framework-lock waits.
6. WAL, busy timeout, or retry changes MUST NOT be presented as a fix for application-lock contention without evidence.
7. History materialization or pagination MUST preserve the selected consistency contract and result set used by the correctness oracle.
8. An optimization MUST NOT drop checkpoints, truncate history, weaken durability, or silently reduce required context merely to improve latency.
9. Before/after measurements MUST use the same workload shape, backend version, and measurement method where practical.
10. All retry loops MUST be bounded; a timeout increase alone MUST NOT constitute successful optimization.
11. The implementing engineer MUST NOT be the only verifier for a checkpoint concurrency change.
12. A regression in history correctness or a threshold violation MUST block completion.
