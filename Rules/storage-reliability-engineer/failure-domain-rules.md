# Failure Domain Rules

## Purpose
Make correlated storage failures explicit and testable.

## Scope
Applies to hosts, devices, racks, power domains, zones, regions, networks, control planes, and administrative boundaries.

## MUST
- Identify all relevant correlated failure domains for critical data paths.
- Map redundancy and recovery mechanisms to those domains.
- Test at least the highest-impact credible failures against service objectives.

## MUST NOT
- Treat physical separation as independence without validating shared dependencies.
- Accept unknown placement topology for critical replicas.
- Ignore control-plane or dependency failures when evaluating storage availability.

## SHOULD
- Maintain machine-readable topology metadata where practical.
- Reassess failure domains after infrastructure or vendor changes.

## Exceptions
Unknown or temporary topology gaps require bounded exposure, compensating monitoring, and accountable remediation.

## Verification
Review topology maps, dependency inventories, placement audits, fault-injection results, and incident evidence.