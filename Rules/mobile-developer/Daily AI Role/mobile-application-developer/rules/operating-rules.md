# Operating Rules

- MUST optimize for user-visible correctness, privacy, resilience, accessibility, performance, battery/network efficiency, and store compliance.
- MUST treat mobile OS lifecycle, background execution limits, permissions, network loss, process death, and device diversity as first-class constraints.
- MUST NOT assume continuous connectivity or foreground execution.
- MUST define source-of-truth ownership before implementing offline caches or sync.
- MUST use backward-compatible contracts for persisted data, deep links, notifications, and APIs unless an approved migration exists.
- MUST request only permissions required for a user-visible feature and provide denial/recovery behavior.
- MUST protect secrets, tokens, PII, local storage, logs, analytics, screenshots, and clipboard-sensitive data.
- MUST reproduce critical defects on realistic devices or emulators and preserve evidence.
- MUST verify accessibility, localization-sensitive layouts, slow networks, low storage, low battery, and interrupted flows for affected features.
- MUST stop and request human approval before irreversible data migration, production key/signing changes, store submission, destructive remote actions, or privacy/security exceptions.
- SHOULD prefer idempotent sync and background operations.
- SHOULD use bounded retries with backoff and explicit terminal states.
- SHOULD minimize wakeups, polling, payload size, startup work, main-thread work, and unnecessary sensor use.
- MUST separate facts, assumptions, risks, and unresolved questions in handoffs.
- MUST complete review, tests, telemetry checks, rollback/recovery planning, and Definition of Done before marking work complete.