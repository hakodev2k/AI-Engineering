# AI Cost Allocation

## Purpose
Design defensible allocation of AI infrastructure and model-service costs to products, teams, tenants, or experiments. The goal is to make spend attributable enough to drive engineering decisions without pretending shared costs are perfectly precise.

## When to use
Use when GPU clusters, managed model APIs, vector stores, training jobs, or shared AI platforms serve multiple owners. Do not use simplistic equal-split allocation when usage varies materially.

## Inputs
- Cloud and vendor billing exports
- GPU/accelerator telemetry
- Model API usage records
- Job, team, product, tenant, and environment metadata
- Shared platform cost pools
- Organizational ownership rules

## Preconditions
Reliable identifiers must exist for at least the major cost drivers. If tagging is incomplete, quantify the unallocated portion instead of fabricating precision.

## Context to inspect
Inspect billing dimensions, cluster namespaces, job schedulers, API keys/service accounts, workload labels, model endpoints, storage/network charges, reservations, credits, and shared services.

## Core knowledge
Allocation commonly combines direct attribution, metered shared usage, and policy-based allocation. For AI workloads, important cost drivers include accelerator time, reserved capacity, tokens, storage, data movement, vector indexing, batch duration, and idle headroom. Allocation and showback are management tools, not accounting truth unless finance has approved the method.

## Procedure
1. Define allocation consumers and decisions the model should support.
2. Separate direct, shared, committed, and unallocated costs.
3. Map billing resources to operational telemetry.
4. Select allocation keys that approximate causal consumption, such as accelerator-seconds or tokens.
5. Establish ownership metadata and fallback rules.
6. Treat idle capacity explicitly rather than hiding it inside active workloads.
7. Allocate commitments and discounts using a documented policy.
8. Preserve gross, discounted, and allocated views where useful.
9. Add confidence or coverage metrics for attribution quality.
10. Reconcile allocated totals to source billing totals.
11. Publish showback views and investigate large unexplained changes.
12. Review the method periodically as architecture changes.

## Decision points
- Use direct attribution when billing identifiers are available.
- Use metered allocation for shared infrastructure when reliable usage telemetry exists.
- Use policy allocation only when technical attribution is impractical.
- Keep idle or stranded capacity visible if teams can influence it.

## Common failure patterns
- Double-counting shared costs.
- Ignoring credits or commitments.
- Allocating idle GPU capacity entirely to productive workloads.
- Missing storage and network charges.
- Inconsistent team labels.
- Treating estimated allocation as invoice-grade accounting.

## Verification
Allocated plus unallocated totals must reconcile to source billing within an agreed tolerance. Sample workloads should trace from billing records to owners. Changes in usage should produce directionally correct cost changes.

## Expected output
An allocation model, ownership mapping, reconciliation report, attribution coverage metric, and showback dataset/dashboard.

## Stop conditions
Stop and escalate when ownership cannot be established, billing exports are incomplete, allocation conflicts with finance policy, or the proposed method materially misrepresents responsibility.