# Queue Safety Rules

## MUST
- Preserve message id, delivery count, payload hash and error fingerprint as evidence before changing retry behavior.
- Distinguish retryable from deterministic failures.
- Use finite retries and a terminal quarantine/dead-letter path.
- Prove idempotency or duplicate-suppression behavior before any replay recommendation.
- Redact credentials, cookies, tokens, personal data and raw sensitive payloads from reports.
- Test acknowledgement ordering and duplicate delivery.
- Require explicit human approval for production replay, broker policy/retention changes, deletion, infrastructure/configuration changes, secret changes and schema-breaking changes.

## MUST NOT
- Retry indefinitely or use an unbounded autonomous test-fix loop.
- Acknowledge a message as successful before required side effects are durably committed.
- Delete poison messages to make monitoring green.
- Replay production messages automatically.
- Increase broker/tool permissions to bypass an access failure.
- Store raw production payloads in repository artifacts by default.
- Treat every exception as transient.

## SHOULD
- Prefer broker-native dead-letter facilities plus application-level reason metadata.
- Use deterministic error fingerprints to group repeated failures.
- Keep quarantine consumers isolated from the primary processing path.
- Alert on quarantine growth rate and oldest-message age rather than only total count.