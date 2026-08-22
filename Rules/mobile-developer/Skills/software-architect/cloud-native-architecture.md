# Cloud-Native Architecture

## Purpose
Design software to use cloud capabilities deliberately while controlling portability, reliability, security, and operational cost.

## When to use
Use when moving to cloud hosting, adopting managed services, designing elastic systems, or reviewing cloud lock-in and cost.

## Inputs
Cloud platform capabilities, workload profile, NFRs, compliance constraints, cost targets, operational maturity, portability requirements.

## Context to inspect
Compute model, managed databases, messaging, storage, identity, networking, autoscaling, quotas, multi-region needs, infrastructure automation, and cost telemetry.

## Core knowledge
Managed services reduce operational burden but increase provider coupling. Cloud-native design favors automation, immutable deployment, managed identity, elasticity, failure-aware architecture, and cost visibility.

## Procedure
1. Classify workload and state requirements.
2. Identify managed services that remove undifferentiated operations.
3. Evaluate lock-in against actual portability needs.
4. Define identity, network, and secret boundaries.
5. Design for quotas, transient failures, and regional outages.
6. Automate infrastructure and configuration.
7. Define scaling and cost controls.
8. Establish backup, restore, and disaster recovery.
9. Validate architecture under failure and load.

## Decision points
Use serverless for bursty/event-driven workloads when runtime constraints fit. Use containers/long-running compute for sustained workloads or stronger runtime control. Multi-region is justified only by business recovery requirements.

## Common failure patterns
Cloud service selection by novelty, unmanaged cost, static credentials, ignoring quotas, assuming managed means failure-free, and multi-cloud without a concrete business driver.

## Verification
Infrastructure can be reproduced, identity boundaries are tested, scaling and failure scenarios pass, and cost estimates are compared with observed usage.

## Expected output
A cloud architecture with justified service choices, automation, resilience, security, and cost controls.

## Stop conditions
Stop when compliance, data residency, budget, or platform constraints are unresolved.