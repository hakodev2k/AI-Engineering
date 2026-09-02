# Fault Modeling

## Purpose
Build realistic fault models that represent how the system can actually fail, degrade, or recover. This skill keeps experiments grounded in architecture and incident evidence instead of arbitrary perturbations.

## When to use
Use when designing a new experiment family, after incidents reveal new failure modes, or before expanding chaos coverage to a new subsystem.

## Inputs
Architecture diagrams, dependency maps, deployment topology, incident reports, FMEAs, retry policies, timeout settings, capacity limits, and provider behavior.

## Preconditions
The service boundary and major dependencies are understood well enough to identify plausible failure mechanisms.

## Context to inspect
Process lifecycle, network paths, storage, queues, caches, schedulers, control planes, autoscaling, DNS, identity, quotas, regional dependencies, and operator actions.

## Core knowledge
Faults are causes; failures are externally visible incorrect behavior. Senior engineers distinguish crash, omission, timing, Byzantine-like corruption, resource exhaustion, dependency degradation, partial partition, stale data, and operator-induced faults. The model should reflect correlated and cascading failures where architecture makes them plausible.

## Procedure
1. Define the protected capability.
2. Enumerate components and external dependencies.
3. Identify plausible faults for each component.
4. Group faults by common cause and failure domain.
5. Map each fault to expected system-level effects.
6. Mark which faults are already covered by tests or prior experiments.
7. Rank uncovered faults by impact, likelihood, and uncertainty.
8. Select faults that can be simulated with bounded risk.
9. Document assumptions about recovery and redundancy.
10. Update the model after incidents and major architecture changes.

## Decision points
Prioritize high-impact, poorly understood faults over rare but spectacular scenarios. Use correlated faults only when there is evidence of shared infrastructure, software, configuration, or operational coupling.

## Common failure patterns
Equating node loss with all resilience risk; omitting slow or partial failures; ignoring configuration and operator faults; treating redundant components as independent without evidence; and modeling provider abstractions instead of real dependency behavior.

## Verification
Review the model against incident history, architecture documentation, and failure-domain topology. Confirm every selected experiment traces to a plausible fault and a protected capability.

## Expected output
A ranked fault catalog with causes, expected effects, dependencies, assumptions, and experiment candidates.

## Stop conditions
Stop if system topology is too incomplete to bound effects or if a proposed fault cannot be simulated without unacceptable risk.