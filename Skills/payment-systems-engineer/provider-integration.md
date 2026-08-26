# Payment Provider Integration

## Purpose
Integrate payment processors and financial providers without leaking unstable provider semantics into core business logic.

## When to use
Use when adding or replacing gateways, acquirers, wallets, payout providers, fraud services, or banking APIs.

## Inputs
Provider API/docs, sandbox credentials, domain model, SLAs, supported countries/currencies, compliance constraints.

## Context to inspect
Existing adapters, HTTP clients, secret handling, retries, idempotency, webhooks, provider mappings, monitoring.

## Core knowledge
External providers fail partially and evolve independently. Isolate provider contracts behind adapters, preserve raw external identifiers for audit, normalize only stable domain meaning, and treat timeouts as unknown outcomes.

## Procedure
1. Map required capabilities to provider features.
2. Identify unsupported or divergent semantics.
3. Define an adapter boundary.
4. Map domain requests to provider contracts explicitly.
5. Configure authentication and secret rotation.
6. Set bounded timeouts and connection policies.
7. Implement safe retries only for retryable/idempotent operations.
8. Persist provider IDs and attempt metadata.
9. Map errors into stable internal categories while retaining diagnostic detail.
10. Integrate webhook/reconciliation recovery.
11. Add sandbox and contract tests.
12. Define provider health metrics and operational runbooks.

## Decision points
Do not create a lowest-common-denominator abstraction if provider-specific capability is a product requirement. Prefer capability-oriented interfaces over one giant gateway interface.

## Common failure patterns
Blind retries, assuming timeout=failure, logging secrets, provider status leakage, missing API version pinning, and sandbox-only assumptions.

## Verification
Exercise success, decline, timeout, duplicate, malformed response, provider outage, and webhook recovery paths; compare stored state with provider records.

## Expected output
A resilient provider adapter with explicit mappings, failure semantics, tests, metrics, and recovery paths.

## Stop conditions
Escalate if contractual guarantees, compliance requirements, or irreversible retry semantics cannot be established.