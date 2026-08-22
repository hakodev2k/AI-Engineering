# Safety Rules

## MUST
- Validate `config/policy.json` before classification or replay.
- Preserve message ID, source, attempt count, error evidence, payload hash, and consumer version when available.
- Quarantine non-transient failures immediately and transient failures only after the bounded retry budget is exhausted.
- Verify envelope integrity before every replay decision.
- Require explicit human approval for production replay.
- Use an independent verifier for replay when configured.
- Preserve evidence from failed replay attempts.

## MUST NOT
- Retry indefinitely or reset delivery count to evade the retry budget.
- Purge/delete queues, subscriptions, dead-letter stores, or evidence as part of this workflow.
- Store raw payloads when `store_raw_body` is false.
- Put secrets, credentials, tokens, or unnecessary PII in evidence.
- Replay a message more than once automatically.
- Change broker retry/dead-letter policy, production configuration, infrastructure, schemas, or security controls without explicit approval.
- Treat broker acceptance as proof that business processing succeeded.

## SHOULD
- Prefer payload hashes/references and sanitized fixtures over raw bodies.
- Make consumer handlers idempotent before enabling replay of side-effecting messages.
- Correlate replay with downstream logs/records to prove exactly-once intended outcome.
- Fix the smallest evidenced defect before changing retry budgets.
