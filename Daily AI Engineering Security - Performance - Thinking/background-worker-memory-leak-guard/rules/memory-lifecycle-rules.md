# Memory Lifecycle Rules

1. A performance claim **MUST** include an idle baseline and post-workload measurement.
2. Sampling **MUST** distinguish RSS from VSZ and **MUST** preserve PID, PPID, elapsed age, and command identity.
3. A worker **MUST NOT** be classified stale solely because CPU is zero at one sample.
4. Active or ownership-unknown processes **MUST NOT** be automatically terminated.
5. Post-job verification **MUST** wait an explicit cooldown and use at least three samples.
6. A regression **MUST** block completion when retained tree RSS or stale-worker count exceeds configured budget.
7. Containment tooling **MUST** be separate from measurement tooling and **MUST** require explicit approval for destructive actions.
8. Daemon restart **MUST NOT** be treated as proof that a leak is fixed; post-restart worker adoption/reaping **MUST** be measured.
9. Experiments **SHOULD** vary one lifecycle factor at a time.
10. Retries **MUST** be bounded to two collection retries and three remediation hypotheses.
11. Verification **MUST** be performed by a role that did not implement the remediation.
12. Thresholds **MUST NOT** be raised merely to convert a failing run into a pass.