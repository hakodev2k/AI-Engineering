# State and Memory Rules
## Purpose
Prevent stale, unsafe, or incorrect agent state from driving decisions.
## Scope
Conversation state, durable memory, checkpoints, and working context.
## MUST
- Define ownership, lifetime, source, sensitivity, and invalidation rules for persisted state.
- Validate critical remembered facts against authoritative sources before consequential actions.
- Isolate state across users and tenants.
## MUST NOT
- Persist secrets or sensitive data without explicit need and approved protection.
- Treat model-generated summaries as authoritative records.
## SHOULD
- Store minimal durable state and preserve provenance for decision-relevant facts.
## Exceptions
Long retention requires documented purpose, access controls, and retention policy.
## Verification
Inspect schemas, retention settings, tenant-isolation tests, provenance, and stale-state tests.