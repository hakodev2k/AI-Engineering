# Dead-Letter Queue Replay Rules

## MUST

- Identify the exact source environment, queue/topic, and message IDs before replay.
- Preserve original message identifiers and correlation identifiers in evidence.
- Verify tenant/account scope for every selected message before execution.
- Establish the original failure cause with logs, handler errors, broker metadata, tests, or equivalent evidence.
- Verify the relevant handler, schema, routing, and dependency state differs from the state that caused the failure, unless the cause was transient and that is evidenced.
- Demonstrate handler idempotency, deduplication, or a safe compensating strategy before replaying messages that can create external side effects.
- Run `scripts/replay_guard.py` and retain its output before execution.
- Use an explicit finite message-ID set; production wildcard/range/all-message replays require separate human approval and are blocked by default.
- Keep replay batch size at or below policy maximum.
- Record a receipt for every execution attempt.
- Stop subsequent batches if a replayed message returns to the DLQ or produces an unexpected business side effect.
- Require independent verification after implementation or incident-fix changes.
- Require human approval for every production replay and bind approval to the exact plan fingerprint.

## MUST NOT

- Purge, delete, truncate, or alter DLQ retention as part of the replay workflow.
- Replay an entire production DLQ merely because individual sample messages succeeded.
- Silently change payloads, tenant identifiers, destinations, routing keys, or message IDs while calling the operation a replay.
- Treat a successful broker publish acknowledgement as proof the business operation succeeded.
- Reprocess non-idempotent financial, notification, provisioning, deletion, or external-write messages without explicit safety evidence and approval.
- Increase broker permissions, disable authorization, expose secrets, or copy credentials into evidence files to unblock replay.
- Retry business-rule or schema failures automatically.
- Exceed the plan's retry limit even when policy permits a larger limit.
- Force-push, deploy, migrate databases, modify infrastructure, change production configuration, or weaken security controls as an implicit part of replay.

## SHOULD

- Start with the smallest representative batch and expand only after verification.
- Prefer immutable exported message metadata for investigation.
- Include handler version, schema version, routing destination, and correlation ID in replay evidence when available.
- Use provider-native deduplication/idempotency features in addition to application-level guarantees.
- Keep observation windows and downstream verification queries explicit and reproducible.
- Redact message bodies in evidence when metadata is sufficient; do not persist secrets or unnecessary personal data.
