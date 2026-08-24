# Networking and Firewall

## Purpose
Maintain secure, diagnosable Windows connectivity without unnecessary exposure.

## Scope
TCP/IP configuration, routing dependencies, Windows Firewall, proxies, name resolution interactions, and administrative ports.

## MUST
- Firewall rules MUST be scoped to required protocol, port, direction, source/destination, profile, and purpose.
- Connectivity changes MUST identify dependent services and rollback.
- Administrative protocols MUST be restricted to trusted networks or identity-aware controls where feasible.
- Broad production firewall weakening MUST require explicit human approval.

## MUST NOT
- MUST NOT disable the host firewall as a troubleshooting default.
- MUST NOT open Any/Any rules when a narrower rule can satisfy the requirement.
- MUST NOT assume network reachability proves application health.

## SHOULD
- Use packet, connection, route, DNS, and firewall evidence to isolate failures.
- Remove obsolete rules after dependency validation.

## Exceptions
Require reason, scope, duration, risk, compensating controls, and approval.

## Verification
Inspect effective firewall policy, routes, bindings, DNS, listening sockets, connection tests, packet evidence when needed, and representative service transactions.