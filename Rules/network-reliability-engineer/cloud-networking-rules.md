# Cloud Networking Rules

## Purpose
Keep cloud network architecture reliable across accounts, regions, virtual networks, managed gateways, and service endpoints.

## Scope
Cloud routing, virtual networks, gateways, private connectivity, managed load distribution, and cross-region connectivity.

## MUST
- Cloud network designs MUST document ownership, address boundaries, routing intent, and critical dependencies.
- Regional and zonal failure assumptions MUST match the availability requirements of dependent services.
- Managed-service limits and quotas that can affect connectivity MUST be known and monitored.
- Cross-environment connectivity changes MUST be validated for unintended reachability impact.

## MUST NOT
- MUST NOT assume managed services eliminate the need for capacity or failure planning.
- MUST NOT duplicate overlapping address space where connectivity between environments is expected unless a deliberate translation strategy exists.
- MUST NOT make production connectivity changes solely through undocumented console actions.

## SHOULD
- Prefer infrastructure-as-code for repeatable cloud network changes.
- Keep environments and blast radii separated where practical.

## Exceptions
Exceptions require constraints, risk, compensating controls, and approval.

## Verification
Review cloud network definitions, quotas, topology, routing intent, change history, and failure tests.