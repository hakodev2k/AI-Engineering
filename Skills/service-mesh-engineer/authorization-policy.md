# Mesh Authorization Policy

## Purpose
Implement least-privilege service-to-service authorization based on authenticated workload identity and explicit traffic intent.

## When to use
Use when creating or reviewing allow/deny policy, tenant isolation or sensitive service boundaries.

## Inputs
Traffic graph, workload identities, API paths/methods, trust zones, exception requirements and audit evidence.

## Context to inspect
Existing authorization resources, namespace defaults, gateways, identity claims, protocol limitations and application-level authorization.

## Core knowledge
Network reachability, mesh authorization and application authorization are distinct controls. Default-deny reduces implicit trust but requires accurate dependency discovery. L7 rules depend on protocol visibility.

## Procedure
1. Map legitimate caller-to-service relationships.
2. Classify sensitive operations and data.
3. Establish default-deny at a safe scope.
4. Add narrowly scoped allows by workload identity.
5. Add L7 constraints only where protocol semantics are reliable.
6. Separate machine authorization from end-user authorization.
7. Stage policy with audit/observe modes where available.
8. Test positive and negative cases.
9. Monitor denials and exception drift.
10. Periodically remove unused grants.

## Decision points
Prefer identity-based policy over IP-based policy in dynamic environments. Use mesh L7 policy for coarse service boundaries; keep domain/business authorization in the application.

## Common failure patterns
Wildcard principals, namespace-wide exceptions, policies based on unstable IPs, accidental lockout, assuming JWT presence implies permission and unowned permanent exceptions.

## Verification
Run authorized and unauthorized probes, inspect decision telemetry, validate fail-closed behavior and compare effective policy to the intended traffic graph.

## Expected output
Minimal, testable authorization policy plus exception ownership.

## Stop conditions
Escalate when legitimate dependencies are unknown, identity is ambiguous, or policy changes could block critical production paths without rollback.