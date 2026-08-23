# Rollback and Failover Rules

## Purpose
Recover service safely using known-good states or alternate capacity.

## Scope
Application rollback, configuration rollback, database compatibility, regional failover, dependency failover, and disaster-recovery activation.

## MUST
- Validate rollback or failover compatibility with current data, schema, configuration, dependencies, and traffic state before execution when feasible.
- Define success and abort criteria before initiating a high-impact recovery action.
- Verify health from customer-facing and dependency perspectives after transition.
- Preserve a path to reverse the recovery action when possible.

## MUST NOT
- Assume older software can safely consume data written by newer versions.
- Declare failover successful from infrastructure health alone while customer journeys remain impaired.

## SHOULD
- Exercise rollback and failover procedures before incidents and record known limitations.

## Exceptions
When ongoing harm exceeds transition risk, emergency failover may proceed with incomplete validation under explicit incident-command approval.

## Verification
Review compatibility evidence, recovery logs, traffic state, end-to-end health, and success/abort criteria.