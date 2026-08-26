# Rules: Retry and Stop Conditions

- Every retryable operation MUST have a stable retry key and attempt counter.
- A repeated deterministic failure MUST NOT be retried beyond the configured identical-failure budget unless a causal input changes or explicit human approval is obtained.
- Assistant text such as "continuing", "working", or a repeated plan MUST NOT count as progress.
- Qualifying progress SHOULD be grounded in observable state: changed tool result, file/repository change, test-state change, new evidence, or persisted checkpoint.
- A watchdog MUST NOT classify an agent as stalled solely from total wall-clock duration when recent qualifying activity exists.
- Restarted agents SHOULD resume from a valid checkpoint rather than repeat repository discovery and setup.
- Each logical retry key MUST have a token/resource budget.
- Retry loops MUST be bounded; the default maximum no-progress streak is two attempts.
- A blocked retry MUST preserve the latest valid checkpoint and failure evidence.
- Dangerous, irreversible, production, credential, or external-write retries MUST require explicit human approval when policy demands it.
- Completion MUST be verified against acceptance criteria and external state, not model self-report alone.
