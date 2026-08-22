# Technical Risk Management

## Purpose
Identify, quantify, mitigate, and communicate architecture risks before they become production incidents or program surprises.

## When to use
Use for major initiatives, unfamiliar technology, migrations, external dependencies, high-scale launches, and regulated systems.

## Inputs
Architecture, assumptions, NFRs, dependencies, delivery plan, operational history, proof-of-concept evidence.

## Preconditions
Decision drivers and owners are known.

## Context to inspect
Unknowns, irreversible decisions, vendor dependencies, capacity, data migration, security, staffing, schedule coupling, failure modes.

## Core knowledge
Risk combines uncertainty and impact. Architecture spikes should target uncertainty, not become hidden production builds. Risk retirement should happen early for items with high consequence.

## Procedure
1. Identify technical and operational uncertainties.
2. Estimate likelihood and impact qualitatively or quantitatively.
3. Prioritize by exposure.
4. Assign accountable owners.
5. Define mitigation, avoidance, transfer, or acceptance strategy.
6. Create focused experiments for uncertain assumptions.
7. Define leading indicators and trigger conditions.
8. Track residual risk after mitigation.
9. Escalate risks beyond team authority.
10. Reassess as evidence changes.

## Decision points
Prototype only when it reduces a specific high-value uncertainty. Accept risk explicitly when mitigation cost exceeds expected impact and accountable owners agree.

## Common failure patterns
Risk register without actions, hiding uncertainty, proof-of-concept treated as production-ready, late discovery of dependency constraints.

## Verification
Top risks have owners, mitigation evidence, residual-risk status, and trigger conditions.

## Expected output
Prioritized architecture risk register with active treatments.

## Stop conditions
Stop and escalate when residual risk exceeds accepted business tolerance.