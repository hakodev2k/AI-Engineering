# Production Mesh Troubleshooting

## Purpose
Diagnose mesh incidents systematically across application, proxy, discovery, identity, policy and network layers.

## When to use
Use for 5xx spikes, connection failures, unexpected denials, latency or routing anomalies.

## Inputs
Incident timeline, affected flows, logs, metrics, traces, proxy config and recent changes.

## Context to inspect
Caller and destination health, DNS, endpoints, listeners/routes/clusters, mTLS, authorization, gateways and underlying network.

## Core knowledge
A proxy-visible failure is not necessarily proxy-caused. Troubleshooting should follow the request path and distinguish configuration intent from effective runtime state.

## Procedure
1. Define exact affected caller, destination, protocol and time window.
2. Check application health and recent deploys.
3. Reproduce from the same network/identity context.
4. Verify DNS and endpoint discovery.
5. Inspect effective proxy listeners, routes and clusters.
6. Check TLS handshake and peer identity.
7. Inspect authorization decisions.
8. Compare healthy and failing instances.
9. Correlate traces with proxy response flags/logs.
10. Mitigate with the smallest reversible change.
11. Confirm recovery and preserve evidence for RCA.

## Decision points
Bypass or rollback only when it reduces user impact without creating unacceptable security risk. Prefer evidence from effective proxy state over desired YAML alone.

## Common failure patterns
Random restarts destroying evidence, blaming the mesh from 503 alone, testing from a different identity, ignoring DNS and changing multiple layers simultaneously.

## Verification
Re-run the failing request, confirm SLO recovery and identify a causal mechanism rather than correlation.

## Expected output
A root cause or bounded hypothesis set, mitigation and follow-up actions.

## Stop conditions
Escalate when production access, security-sensitive bypass or destructive changes are required.