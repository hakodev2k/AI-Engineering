# Vendor, Model, and Platform Selection

## Purpose
Select model providers and AI platforms through evidence-based comparison of capability, architecture fit, operational constraints, security, portability, and total cost.

## When to use
Use for initial platform selection, procurement, provider consolidation, model migration, or when a current vendor no longer satisfies requirements.

## Inputs
Functional requirements, NFRs, evaluation cases, data constraints, deployment preferences, integration needs, pricing, support expectations, and exit requirements.

## Context to inspect
Inspect provider APIs, model catalog, service limits, regional availability, data-handling options, identity integration, observability, versioning policy, quotas, support model, and current application coupling.

## Core knowledge
Provider choice is an architecture decision, not a benchmark contest. The best option balances task quality, latency, cost, data governance, availability, ecosystem fit, operational maturity, and switching cost. Portability has a cost and should target the interfaces where change is plausible.

## Procedure
1. Convert mandatory requirements into disqualifying gates.
2. Build representative workload evaluations for candidate models.
3. Measure quality, latency, failure behavior, and unit cost.
4. Compare regional, privacy, identity, networking, and quota capabilities.
5. Assess SDK/API stability and model-version lifecycle.
6. Evaluate operational tooling, support, and incident visibility.
7. Identify proprietary features that create meaningful lock-in.
8. Define abstraction boundaries only where portability has business value.
9. Model migration effort and fallback options.
10. Record the decision, assumptions, rejected options, and reevaluation triggers.

## Decision points
Choose a single provider when simplicity outweighs concentration risk. Use multiple providers only when resilience, capability diversity, or commercial leverage justifies duplicated integration and evaluation work. Avoid lowest-price selection when it increases failure or review cost.

## Common failure patterns
Selecting from public benchmarks alone, ignoring rate limits and regions, overengineering provider abstraction, failing to test real workloads, and assuming model aliases never change behavior.

## Verification
The selected platform passes mandatory gates and representative evaluations, and the team can explain operational responsibilities, cost, lock-in, and migration path.

## Expected output
A provider decision matrix, recommendation, architecture implications, portability strategy, and reevaluation criteria.

## Stop conditions
Stop when critical commercial or data-handling terms are unknown, mandatory regions are unavailable, or representative workloads cannot be evaluated.