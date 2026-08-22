# Network and Data Transfer Costs

## Purpose
Identify and reduce avoidable data-transfer and networking charges while preserving latency, security, availability, and architecture requirements.

## When to use
Use when egress, inter-region, cross-zone, NAT, CDN, or private connectivity costs are material or unexpectedly growing.

## Inputs
Billing dimensions, network flow/traffic metrics, topology, regions/zones, CDN usage, NAT gateways, service endpoints, data replication patterns.

## Context to inspect
Inspect traffic direction, source/destination, cross-zone behavior, inter-region replication, internet egress, CDN hit rate, NAT processing, managed-service transfer rules, and contractual pricing.

## Core knowledge
Cloud network pricing is topology-dependent and provider-specific. A lower-cost path can increase latency, reduce resilience, or weaken security. Optimize data movement before merely changing products.

## Procedure
1. Decompose network spend by charge type and location.
2. Map expensive charges to traffic flows and owners.
3. Validate whether traffic is necessary and expected.
4. Quantify cross-zone/region, NAT, internet, and CDN patterns.
5. Evaluate locality, caching, compression, batching, private endpoints, CDN, or architecture changes.
6. Model cost and reliability implications.
7. Test changes with representative traffic.
8. Monitor latency, availability, and transfer volume.
9. Confirm billing impact.
10. Add alerts for abnormal transfer patterns.

## Decision points
Keep cross-zone/region traffic when required for resilience. Prefer reducing bytes moved before sacrificing redundancy. Use CDN when cacheability and user distribution justify it.

## Common failure patterns
Disabling multi-zone designs solely for cost, assuming private networking is always cheaper, ignoring NAT processing fees, and optimizing list price without traffic-flow evidence.

## Verification
Flow metrics explain billed transfer; SLOs remain satisfied; security controls remain intact; billing confirms savings.

## Expected output
A network-cost map, prioritized optimization options, trade-off analysis, and verified outcome.

## Stop conditions
Escalate when proposed topology changes affect disaster recovery, compliance, or security boundaries.