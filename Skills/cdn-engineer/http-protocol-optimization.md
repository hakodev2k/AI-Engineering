# HTTP Protocol Optimization

## Purpose
Tune HTTP/1.1, HTTP/2, and HTTP/3 delivery based on measured client and network behavior.

## When to use
Use when improving latency, connection efficiency, multiplexing, or diagnosing protocol-specific failures.

## Inputs
Protocol adoption, handshake timing, RTT, loss, request concurrency, object sizes, client compatibility.

## Context to inspect
Edge protocol settings, ALPN, QUIC/UDP reachability, origin protocol, connection reuse, prioritization, compression.

## Core knowledge
HTTP/2 multiplexes streams over TCP; HTTP/3 uses QUIC to reduce transport head-of-line effects and improve connection establishment. Benefits depend on network conditions and implementation quality.

## Procedure
1. Establish protocol usage and latency baselines.
2. Separate DNS, TCP/QUIC, TLS, TTFB, and transfer time.
3. Enable modern protocols with fallback paths.
4. Verify ALPN negotiation and UDP reachability.
5. Tune connection reuse and keepalive behavior.
6. Avoid obsolete HTTP/1-era optimizations that harm multiplexed protocols.
7. Measure by geography, network type, and client family.
8. Investigate regressions before broad rollout.

## Decision points
Enable HTTP/3 when client/network coverage and measurements support it; retain HTTP/2 fallback. Origin HTTP/2 may help connection efficiency but is independent of client-edge protocol.

## Common failure patterns
Assuming HTTP/3 is universally faster, excessive domain sharding, broken QUIC due to firewalls, protocol metrics aggregated beyond usefulness, and short keepalives.

## Verification
Compare handshake and page/request latency by protocol, test fallback, packet loss scenarios, and representative clients.

## Expected output
A measured protocol policy with compatibility safeguards and performance evidence.

## Stop conditions
Stop rollout if error rate, handshake failures, or tail latency materially regress for important client cohorts.