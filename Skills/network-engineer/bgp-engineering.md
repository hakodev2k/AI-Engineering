# BGP Engineering

## Purpose
Design, change, and troubleshoot BGP safely across Internet, WAN, data-center, and cloud routing domains.

## When to use
Use for eBGP/iBGP deployment, peering changes, traffic engineering, route leaks, convergence problems, or multi-homing.

## Inputs
ASNs, prefixes, peer policy, topology, RIB/FIB state, advertisements, communities, route maps/policies, telemetry, and provider constraints.

## Context to inspect
Session state, capabilities, import/export policy, best-path attributes, next-hop reachability, route reflection, multipath, max-prefix, RPKI controls, and historical route changes.

## Core knowledge
BGP is policy-driven reachability. Diagnose received, accepted, selected, installed, and advertised routes separately. Local preference generally controls outbound exit choice; AS-path/prepending and provider communities can influence inbound traffic but never guarantee it.

## Procedure
1. Define desired reachability and policy before editing configuration.
2. Capture baseline sessions, prefixes, best paths, and traffic.
3. Trace one affected prefix through Adj-RIB-In, policy, Loc-RIB, FIB, and export.
4. Validate next-hop resolution and IGP dependencies.
5. Review prefix filters, AS-path filters, communities, local preference, MED, and route limits.
6. Check route-reflector and multipath behavior where relevant.
7. Model withdrawal and peer-loss behavior.
8. Apply least-scope policy changes.
9. Monitor session stability, route counts, path changes, traffic, and errors.
10. Confirm both forward and return paths.

## Decision points
Prefer explicit policy over attribute tricks. Use route reflection for scalable iBGP while understanding path-visibility trade-offs. Use BFD only when the underlying platform and failure mode justify aggressive detection.

## Common failure patterns
Route leaks, default-route surprises, unbounded redistribution, missing max-prefix, next-hop-self mistakes, community stripping, accidental preference inversion, unstable aggressive timers, and assuming inbound path control.

## Verification
Verify expected prefixes are received, selected, installed, and advertised; test failover; inspect data-plane traffic; confirm no unexpected route propagation.

## Expected output
Validated BGP policy/configuration, before/after route evidence, risk and rollback notes, and monitoring results.

## Stop conditions
Stop on unexplained route-count growth, potential Internet route leak, unknown export policy, loss of management reachability, or changes requiring provider coordination without a rollback path.