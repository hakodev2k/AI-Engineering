# External Call Request

## Goal
<desired outcome>

## Target
- Service/tool: <name>
- Environment: <dev|staging|production>
- Operation: <method/action>
- Expected postcondition: <measurable condition>

## Side effects
- Classification: <read-only|idempotent|idempotent-with-key|non-idempotent|unknown>
- Idempotency mechanism: <key/token/none>
- Duplicate-side-effect risk: <description>

## Resilience inputs
- Timeout seconds: <value>
- Current circuit state: <closed|open|half-open>
- Attempt number: <n>
- Latest status/error kind: <value>
- Retry-After: <seconds or none>

## Verification
- Independent read/check: <method>
- Success evidence: <what proves completion>

Do not include secrets, tokens, credentials, or sensitive payloads.
