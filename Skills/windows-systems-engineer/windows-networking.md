# Windows Networking

## Purpose
Design and troubleshoot Windows host networking across addressing, routing, name resolution, firewalling, proxies, and transport behavior.

## When to use
Use for connectivity failures, server onboarding, network configuration changes, intermittent transport problems, or service reachability analysis.

## Inputs
Source/destination, protocol/port, expected path, IP configuration, DNS records, firewall policy, proxy/load-balancer context, and timestamps.

## Preconditions
Separate host, network, name-resolution, and application hypotheses. Preserve packet/log evidence for intermittent incidents.

## Context to inspect
`Get-NetIPConfiguration`, routes, interfaces, DNS client settings/cache, `Resolve-DnsName`, `Test-NetConnection`, Windows Firewall rules/profiles, proxy settings, connection state, NIC errors, and packet captures when needed.

## Core knowledge
Connectivity is layered: name resolution, route selection, ARP/ND, filtering, transport establishment, TLS, then application protocol. Windows network profiles and firewall scopes matter. DNS success does not prove service reachability; a successful TCP handshake does not prove application health.

## Procedure
1. State the exact failing flow and expected behavior.
2. Reproduce from the affected source when safe.
3. Resolve the destination and compare expected addresses.
4. Inspect local addressing, route selection, and interface health.
5. Test the specific transport port rather than generic ping alone.
6. Inspect local firewall, proxy, VPN, and endpoint security effects.
7. Compare a working and failing host/path.
8. Capture packets when state remains ambiguous.
9. Correct the narrowest identified cause.
10. Re-test end-to-end and monitor for recurrence.

## Decision points
Use packet capture when logs cannot establish where packets stop or retransmit. Escalate to network infrastructure teams only with source, destination, time, protocol, path evidence, and host-side findings.

## Common failure patterns
Treating ping as definitive, flushing DNS without diagnosis, disabling firewalls broadly, ignoring IPv6, overlooking proxy settings, and changing multiple network layers simultaneously.

## Verification
Verify DNS answers, route/path, port establishment, application transaction, firewall behavior, and stable performance over a representative interval.

## Expected output
An evidence-backed root cause or a narrowly scoped escalation package.

## Stop conditions
Stop before broad firewall disablement, routing changes outside ownership, destructive NIC resets on critical hosts, or when packet evidence indicates an upstream domain outside authorization.