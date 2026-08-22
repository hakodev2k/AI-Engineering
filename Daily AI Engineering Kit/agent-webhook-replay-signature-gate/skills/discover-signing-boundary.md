# Discover Signing Boundary

## Purpose
Establish the exact transport and provider contract before code changes.

## Inputs
Webhook route/provider, repository, provider documentation or existing SDK contract.

## Procedure
1. Locate the route/controller/function and middleware executed before it.
2. Trace request-body handling from socket/framework input through parsing/deserialization.
3. Prove whether immutable raw bytes remain available at verification time.
4. Identify signature, timestamp, event-id headers and the exact signed-message construction from trusted provider documentation or SDK code.
5. Locate secret/key retrieval without reading secret values into agent output.
6. Trace duplicate-event handling and every protected side effect.
7. Locate tests, fixtures, retry behavior, proxy/gateway transformations, and persistence constraints.
8. Record facts and evidence; label unresolved protocol details as open questions, not facts.
9. Produce evidence JSON matching `schemas/evidence.schema.json` with status `ready` only if implementation can proceed safely.

## Allowed tools
Repository search/read, tests, local build, official provider docs. Secret values are forbidden context.

## Stop conditions
Stop as `blocked` if the signing contract is ambiguous, raw body is irrecoverably altered before verification, or safe replay identity cannot be established.