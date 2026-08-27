# DNS Incident Troubleshooting

## Purpose
Diagnose DNS incidents systematically from client query through recursion and authority.

## When to use
NXDOMAIN/SERVFAIL spikes, timeouts, wrong answers, partial geographic failures, or intermittent resolution.

## Inputs
Affected names/clients, timestamps, resolver addresses, dig-like outputs, logs, packet captures, recent changes.

## Context to inspect
Client cache, resolver cache, delegation, authoritative answers, DNSSEC, network reachability, EDNS, TCP fallback, split views, and provider status.

## Core knowledge
Start with the exact question: name, type, class, resolver, client context. Different failure codes imply different paths. Always distinguish authoritative truth from cached recursive state.

## Procedure
1. Reproduce exact query from affected and control clients.
2. Record response code, flags, answer, authority, TTL, and server.
3. Query authoritative servers directly.
4. Trace delegation iteratively.
5. Check resolver cache/forwarding behavior.
6. Validate DNSSEC chain if SERVFAIL is involved.
7. Test UDP and TCP, IPv4 and IPv6 as relevant.
8. Inspect packet/log evidence for timeout or truncation.
9. Correlate recent zone/config/provider changes.
10. Mitigate with the narrowest reversible action.
11. Verify from representative clients after cache effects.

## Decision points
Flush caches only when stale cache is proven and blast radius is acceptable. Roll back zone changes when authoritative truth is wrong; do not mask it solely at resolvers.

## Common failure patterns
Testing only one resolver, confusing NXDOMAIN with timeout, ignoring negative cache, overlooking DNSSEC, and assuming propagation is instantaneous.

## Verification
Show correct authoritative and recursive answers, stable error/latency metrics, and successful application resolution.

## Expected output
Fault-domain timeline, evidence-backed root cause, remediation, and prevention actions.

## Stop conditions
Escalate suspected registrar compromise, provider-wide outage, unresolved DNSSEC parent state, or lack of authority to change critical zones.