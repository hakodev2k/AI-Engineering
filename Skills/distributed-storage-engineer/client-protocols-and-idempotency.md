# Client Protocols and Idempotency

## Purpose
Design client-facing storage protocols that remain correct under retries, timeouts, leader changes, duplicate requests, and partial failures.

## When to use
Use when defining storage APIs, client SDK behavior, request identifiers, retry policies, pagination, streaming, batching, or write acknowledgement semantics.

## Inputs
API contract, consistency guarantees, operation semantics, timeout budgets, retry policy, authentication model, request sizes, network behavior, and client version constraints.

## Preconditions
Classify every mutating operation as naturally idempotent, conditionally idempotent, or non-idempotent and define the consequence of ambiguous completion.

## Context to inspect
RPC or HTTP contracts, request IDs, deduplication state, version/precondition tokens, redirects, leader discovery, connection pooling, retries, backoff, batching, and error taxonomy.

## Core knowledge
In distributed systems, a timeout does not reveal whether the server committed the request. Correct clients must distinguish transport failure, retryable server failure, conflict, overload, and permanent rejection. Idempotency keys or conditional writes can turn ambiguous retries into safe operations, but deduplication state needs a defined scope and retention period.

## Procedure
1. Define operation semantics and client-visible consistency.
2. Define request and response contracts independent of internal topology.
3. Create a stable error taxonomy with retry guidance.
4. Set end-to-end deadlines and propagate remaining timeout budget.
5. Define bounded retries with backoff and jitter.
6. Add idempotency keys or conditional preconditions for ambiguous writes.
7. Define deduplication scope and retention.
8. Handle leader or shard movement transparently without infinite redirect loops.
9. Define batch partial-success semantics.
10. Add pagination or streaming rules that remain stable across concurrent changes where required.
11. Version the protocol compatibly.
12. Test duplicate, delayed, reordered, timed-out, and redirected requests.

## Decision points
Prefer server-supported idempotency for operations where clients cannot safely reconstruct outcome. Use conditional writes for compare-and-set semantics. Avoid automatic retries for non-idempotent operations unless a unique request identity makes them safe.

## Common failure patterns
Infinite retries, retry storms, duplicated writes, per-attempt rather than end-to-end deadlines, topology details leaking into application contracts, unstable pagination tokens, and clients interpreting all 5xx responses identically.

## Verification
Run integration tests with forced timeouts, duplicate requests, leader changes, partial batch failures, stale routes, and mixed client versions. Confirm exactly the documented outcomes occur.

## Expected output
A robust client protocol with explicit consistency, timeout, retry, idempotency, versioning, and failure semantics.

## Stop conditions
Stop when the server cannot provide enough information or deduplication support to make required write retries safe.