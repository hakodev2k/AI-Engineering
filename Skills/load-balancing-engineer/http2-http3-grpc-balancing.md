# HTTP/2, HTTP/3, and gRPC Balancing

## Purpose
Balance multiplexed and streaming protocols correctly without assuming HTTP/1 connection behavior.

## When to use
Use for gRPC, HTTP/2, QUIC/HTTP/3, streaming APIs, or unexplained imbalance despite many requests.

## Inputs
Protocol versions, ALPN, stream counts, connection lifetimes, backend support, TLS model, and balancing capabilities.

## Context to inspect
Inspect protocol negotiation, connection reuse, stream concurrency, proxy downgrade/upgrade behavior, idle timers, and backend connection pools.

## Core knowledge
HTTP/2 multiplexes many streams over few connections, so connection-level balancing may concentrate requests. gRPC uses HTTP/2 semantics and long-lived channels. HTTP/3 uses QUIC over UDP and has different connection migration and network behavior.

## Procedure
1. Confirm negotiated protocol on each hop.
2. Measure streams per connection and channel lifetime.
3. Determine whether balancing occurs per connection or request/stream.
4. Validate ALPN and TLS termination.
5. Tune backend connection pools and max concurrent streams.
6. Define keepalive and drain behavior.
7. Test streaming and unary calls separately.
8. Test backend churn and connection migration/reconnect.
9. Measure per-backend request distribution.
10. Document protocol-specific limits.

## Decision points
Use L7 request-aware balancing when long-lived multiplexed channels cause concentration. Retain L4 when protocol transparency is required and clients implement appropriate endpoint balancing.

## Common failure patterns
Assuming least-connections balances gRPC calls; HTTP/2 downgrade; incompatible keepalive policies; terminating QUIC without UDP capacity planning; draining connections abruptly.

## Verification
Confirm protocol negotiation, even request distribution, stream continuity, and stable tail latency under backend changes.

## Expected output
A protocol-correct balancing design with connection, stream, and drain settings.

## Stop conditions
Stop when intermediaries do not support the required protocol or client channel behavior cannot be characterized.