# Fault Modeling Rules

## Purpose
Model realistic failure mechanisms so experiments validate credible production risks rather than artificial behavior.

## Scope
Applies to infrastructure, application, dependency, network, resource, data-path, and control-plane fault selection.

## MUST
- Faults MUST map to a plausible failure mode, incident history, threat model, architecture risk, or explicit resilience requirement.
- The injected behavior MUST approximate the important characteristics of the real fault, including duration, partiality, latency, loss, corruption risk, or recovery semantics where relevant.
- Fault assumptions MUST be documented when simulation differs materially from real failure behavior.
- Compound faults MUST identify dependencies and expected interaction effects.

## MUST NOT
- Fault injection MUST NOT be selected merely because a tool supports it.
- A synthetic failure MUST NOT be represented as proof against a materially different real-world failure mode.
- Destructive data corruption MUST NOT be executed in production without explicit human approval and verified recovery capability.

## SHOULD
- Fault models SHOULD be informed by incident records, FMEA, dependency analysis, and capacity limits.
- Experiments SHOULD include partial and degraded failures, not only complete outages.

## Exceptions
Simplified simulations require documented limitations and evidence that they still test the intended resilience property.

## Verification
Review the fault model, architecture mapping, incident evidence, injector configuration, and stated simulation limitations.