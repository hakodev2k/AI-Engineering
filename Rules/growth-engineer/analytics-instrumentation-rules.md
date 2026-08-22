# Analytics Instrumentation Rules

## Purpose
Ensure behavioral data used for growth decisions is accurate, durable, and auditable.

## Scope
Events, properties, identity, attribution fields, schemas, and telemetry pipelines.

## MUST
- Define event semantics, trigger conditions, required properties, identity behavior, and schema ownership before implementation.
- Validate critical events end-to-end in representative environments before relying on them.
- Treat event renames, deletions, identity changes, and semantic changes as compatibility changes.

## MUST NOT
- Emit secrets, credentials, authentication tokens, or unnecessary sensitive data into analytics.
- Infer instrumentation correctness solely from successful client-side calls.

## SHOULD
- Add automated schema validation and monitoring for critical funnel events.

## Exceptions
Temporary diagnostic events require an owner, retention limit, and removal condition.

## Verification
Inspect event schemas, network/server payloads, warehouse records, identity joins, privacy filters, and monitoring for drops or duplication.