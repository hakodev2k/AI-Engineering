# API Integration Rules

## Purpose
Make synchronous API integrations predictable, resilient, and contract-correct.

## Scope
Applies to REST, RPC, GraphQL, SOAP, and other request-response integrations.

## MUST
- Clients MUST honor documented HTTP or protocol semantics, authentication, pagination, rate limits, and error contracts.
- Requests that can be retried MUST have known idempotency behavior.
- Connection, request, and total-operation timeouts MUST be explicit.
- Client behavior MUST distinguish transient failures from permanent failures.
- External response data MUST be validated before trusted use.

## MUST NOT
- MUST NOT use unbounded retries.
- MUST NOT treat every non-success response as equivalent.
- MUST NOT hard-code environment endpoints or credentials in source.

## SHOULD
- Clients SHOULD isolate vendor-specific concerns behind a stable internal boundary.
- Circuit breaking or load shedding SHOULD be considered where dependency failure can cascade.

## Exceptions
Any deviation from contract or resilience requirements MUST document evidence, operational risk, compensating controls, and approval.

## Verification
Inspect client configuration, contract tests, timeout and retry tests, failure simulations, logs, and dependency documentation.