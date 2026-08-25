# Resilience and Failure Rules

## Purpose
Design predictable behavior under broker, network, host, dependency, and application failures.

## Scope
Applies to redundancy, failover, timeouts, retries, leader changes, dependency outages, and partial failure.

## MUST
- Critical failure modes MUST be identified with expected system behavior and recovery objectives.
- Timeouts and retries MUST be bounded and coordinated to avoid synchronized amplification.
- Replication/durability settings MUST match documented loss tolerance.
- Consumers MUST handle transient broker disconnects and partition movement without corrupting processing state.
- Failure recovery MUST be tested under realistic load, not only in idle environments.

## MUST NOT
- MUST NOT assume broker replication protects against producer acknowledgment misconfiguration or application-level data loss.
- MUST NOT retry non-idempotent side effects blindly.
- MUST NOT configure all clients with identical aggressive retry timing that can create thundering herds.
- MUST NOT mask sustained partial failure with unlimited buffering.

## SHOULD
- Failure domains SHOULD be separated according to availability requirements.
- Recovery objectives SHOULD include backlog restoration time, not only service restart time.

## Exceptions
Reduced redundancy requires quantified loss/availability exposure, compensating recovery controls, and owner approval.

## Verification
Run broker/node/network fault tests, dependency outage tests, restart/rebalance tests, inspect durability settings, and measure recovery against objectives.