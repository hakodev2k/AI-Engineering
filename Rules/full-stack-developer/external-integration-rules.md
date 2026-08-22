# External Integration Rules

## Purpose
Contain failure and compatibility risk from third-party systems.
## Scope
External APIs, webhooks, SDKs, identity providers, and services.
## MUST
- Define timeout, retry, rate-limit, authentication, idempotency, and failure semantics per integration.
- Validate inbound webhook authenticity and replay behavior.
- Isolate provider-specific models behind owned boundaries when practical.
## MUST NOT
- Log provider secrets or tokens.
- Assume external availability, ordering, or schema stability without documented guarantees.
## SHOULD
- Use circuit breaking or load shedding where repeated failures can cascade.
## Exceptions
Direct coupling requires explicit simplicity benefit and bounded replacement risk.
## Verification
Contract tests, sandbox tests, failure injection, secret scanning, and integration telemetry.