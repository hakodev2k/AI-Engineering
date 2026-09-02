# Architecture Trade-off Review

## Purpose
Review real-time architecture decisions using explicit trade-offs among determinism, throughput, latency, safety, security, hardware cost, maintainability, and operational complexity.

## When to use
Use for major design changes, new hardware/RTOS selection, multicore adoption, new communication paths, virtualization, or feature additions that consume timing margin.

## Inputs
Requirements, architecture, timing analysis, resource budgets, hardware constraints, safety/security needs, operational goals, cost constraints.

## Context to inspect
Task boundaries, scheduler model, shared resources, interrupt paths, memory policy, I/O/networking, fault containment, observability, deployment and update model.

## Core knowledge
A technically fast design is not automatically a strong real-time design. Senior decisions make assumptions, interference, timing margins, failure modes, validation cost, and long-term maintainability visible. Determinism often requires deliberately rejecting throughput-oriented optimizations.

## Procedure
1. State the decision and required outcomes.
2. Separate hard constraints from preferences.
3. Identify timing-critical paths and interference sources.
4. Compare credible alternatives using latency bounds, analyzability, resource cost, safety/security, and maintainability.
5. Identify assumptions each alternative depends on.
6. Evaluate overload, fault, and upgrade behavior.
7. Quantify timing/resource margin where evidence exists.
8. Prototype or benchmark uncertain high-impact claims.
9. Record the selected option and rejected alternatives.
10. Define re-evaluation triggers and verification obligations.

## Decision points
Prefer the simplest architecture that provides sufficient timing assurance. Choose isolation, dedicated cores/hardware, or specialized RTOS features only when measured or analyzed interference justifies the added complexity and cost.

## Common failure patterns
Optimizing average throughput at the expense of jitter, architecture by benchmark alone, undocumented hardware assumptions, premature multicore complexity, and treating timing margin as spare capacity available to any feature.

## Verification
Review the decision against timing requirements, schedulability/resource analysis, fault behavior, target-hardware evidence, and maintainability constraints.

## Expected output
A decision record with alternatives, trade-offs, quantified evidence, assumptions, risks, and verification plan.

## Stop conditions
Stop when a major alternative cannot be compared because critical timing, safety, or hardware evidence is missing.