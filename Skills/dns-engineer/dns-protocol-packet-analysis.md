# DNS Protocol and Packet Analysis

## Purpose
Analyze DNS wire behavior across UDP, TCP, EDNS, fragmentation, and encrypted transports to isolate protocol failures.

## When to use
Timeouts, truncation, large-response failures, firewall issues, DNSSEC response problems, or intermittent resolver errors.

## Inputs
Queries, packet captures, resolver/authority logs, MTU, firewall policy, network path, protocol settings.

## Context to inspect
Transaction IDs, flags, response codes, EDNS buffer size, TC bit, TCP fallback, fragmentation, ICMP, retries, DNS cookies, and transport ports.

## Core knowledge
Modern DNS is not UDP-only. Large DNSSEC responses, EDNS negotiation, TCP fallback, path MTU, and middleboxes frequently explain selective failures.

## Procedure
1. Capture exact failing query and response path.
2. Decode header flags and sections.
3. Compare advertised EDNS size with actual response.
4. Check truncation and TCP retry.
5. Inspect fragmentation and ICMP behavior.
6. Test UDP and TCP explicitly.
7. Compare small versus large response types.
8. Correlate firewall/NAT state and resolver logs.
9. Test IPv4/IPv6 differences.
10. Apply scoped MTU/firewall/resolver remediation and recapture.

## Decision points
Reduce EDNS buffer size when path fragmentation is unreliable; fix network TCP/fragmentation policy rather than disabling DNSSEC. Use encrypted-transport traces at endpoints when payload is otherwise unavailable.

## Common failure patterns
Blocking TCP/53, dropping fragments, oversized EDNS buffers, ICMP filtering breaking PMTUD, capture offload artifacts, and assuming SERVFAIL is always authoritative.

## Verification
Packet sequence shows successful response or fallback, no unexplained retransmission, and representative large/signed queries succeed.

## Expected output
Protocol timeline, identified failure mechanism, remediation, and packet-level verification.

## Stop conditions
Stop when packet capture would expose prohibited data, vantage points are unauthorized, or encryption prevents required inspection without endpoint cooperation.