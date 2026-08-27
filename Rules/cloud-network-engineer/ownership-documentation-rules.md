# Ownership and Documentation Rules

## Purpose
Ensure cloud network systems remain understandable, operable, and accountable over time.

## Scope
Applies to shared networks, routes, DNS zones, gateways, firewalls, load balancers, connectivity links, and operational runbooks.

## MUST
- Every production network component MUST have an identifiable owner or owning team.
- Architecture documentation MUST describe intended topology, trust boundaries, critical dependencies, and traffic flows.
- Operational runbooks MUST cover common failure modes, validation steps, escalation paths, and recovery actions for critical services.
- Material architecture decisions MUST record constraints, alternatives, trade-offs, and expected operational impact.
- Documentation MUST be updated when production behavior changes materially.

## MUST NOT
- MUST NOT rely on individual memory as the only explanation of critical network behavior.
- MUST NOT leave orphaned shared network resources without ownership.
- MUST NOT document desired state as if it were verified effective state.

## SHOULD
- Prefer automatically generated inventories and diagrams where they can remain accurate.
- Link operational documentation to observable evidence and infrastructure definitions.

## Exceptions
Exceptions require a documented temporary owner, remediation date, operational risk, and approval.

## Verification
Review ownership metadata, diagrams, runbooks, architecture records, infrastructure definitions, and recent change documentation.