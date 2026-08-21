# Rules: Retry Episode Lifecycle

- Every retry MUST belong to an explicit episode identity derived from observable failure class, operation, and relevant state fingerprint.
- Retry counters MUST reset only after a verified recovery boundary or a genuinely new episode.
- Retry counters MUST NOT leak from a completed episode into a later independent episode.
- Unresolved consecutive failures MUST NOT be reclassified as new episodes merely to regain retry budget.
- Terminal failures such as authorization denial, invalid request, or unsafe action MUST NOT be retried automatically.
- After the configured number of identical failures, the next retry MUST change the recovery strategy or stop.
- Each episode MUST have a bounded attempt count and each turn SHOULD have a bounded total episode count.
- Side-effecting operations MUST be checked for idempotency or action status before retry.
- Retry decisions MUST record failure facts, chosen recovery action, outcome, and reset reason; hidden chain-of-thought MUST NOT be requested or stored.
- Terminal errors SHOULD report the active episode and actual attempted actions rather than a misleading aggregate counter.
- A retry-lifecycle change MUST be verified against both separated-failure and consecutive-failure regression cases.
