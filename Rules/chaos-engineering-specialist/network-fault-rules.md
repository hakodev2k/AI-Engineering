# Network Fault Rules

## Purpose
Test resilience to realistic network impairment without confusing connectivity failures with application defects.

## Scope
Applies to latency, packet loss, jitter, partition, DNS failure, connection reset, bandwidth limits, and asymmetric reachability experiments.

## MUST
- Network experiments MUST define direction, protocol, target path, duration, and impairment parameters explicitly.
- Tests MUST account for client timeout, retry, connection-pool, and load-balancer behavior that can amplify network faults.
- Partitions MUST consider asymmetric reachability and split-brain risks where stateful systems are involved.
- Production network faults MUST use bounded selectors and approved blast radius.

## MUST NOT
- Broad firewall or routing changes MUST NOT be used when a safer scoped injector can test the same hypothesis.
- Packet loss or latency values MUST NOT be chosen without relating them to a plausible operating condition or boundary.
- DNS experiments MUST NOT alter shared production records without explicit authorization.

## SHOULD
- Experiments SHOULD test gradual degradation as well as complete disconnection.
- Relevant transport and application-level metrics SHOULD be correlated.

## Exceptions
Infrastructure-level changes require documented necessity, rollback, dependency impact analysis, and human approval.

## Verification
Inspect network rules, target paths, impairment settings, connection metrics, retry behavior, state consistency, and rollback evidence.