# Model API Cost Governance

## Purpose
Control spend for third-party and managed model APIs while preserving developer velocity, model quality, and operational reliability.

## When to use
Use when teams consume external LLM, embedding, vision, speech, reranking, or agent APIs with variable usage-based pricing.

## Inputs
- Vendor pricing and billing exports
- API usage by key, project, model, and endpoint
- Token/request counts
- Rate limits and quotas
- Application quality and latency requirements
- Procurement and contract terms

## Context to inspect
Inspect model routing, API-key ownership, retries, fallback chains, streaming, batch endpoints, cached responses, prompt sizes, output limits, test traffic, and abandoned experiments.

## Core knowledge
Usage-based AI APIs shift cost control from infrastructure provisioning to request behavior. Governance should combine attribution, quotas, budgets, alerts, architectural optimization, and provider negotiation rather than blunt blocking.

## Procedure
1. Inventory providers, models, keys, and owners.
2. Normalize pricing into comparable cost dimensions.
3. Attribute usage to applications, environments, and teams.
4. Separate production, development, testing, and experimentation.
5. Identify high-cost models and abnormal usage patterns.
6. Set budgets and alert thresholds at useful ownership boundaries.
7. Review token limits, retry behavior, batching, caching, and routing.
8. Evaluate lower-cost model substitutions using quality thresholds.
9. Implement quota escalation and exception processes.
10. Track committed-use discounts and contractual minimums.
11. Detect inactive or orphaned keys and services.
12. Reconcile usage telemetry with invoices monthly.

## Decision points
- Use hard quotas for uncontrolled experimentation or abuse risk; soft budgets for critical production services.
- Route to cheaper models only when evaluation demonstrates acceptable quality.
- Prefer batch APIs for non-interactive workloads when discounts outweigh delay.

## Common failure patterns
- Shared API keys that destroy attribution.
- Unlimited output tokens.
- Retry storms multiplying vendor spend.
- Development traffic using premium models unnecessarily.
- Cost optimization without regression evaluation.

## Verification
Confirm invoice reconciliation, attribution coverage, budget-alert delivery, and measured savings after optimization. Verify quality and latency remain within defined thresholds.

## Expected output
A governed model-API portfolio with ownership, budgets, quota policy, optimization actions, and monthly reconciliation.

## Stop conditions
Stop when contractual pricing is unavailable, attribution is impossible, or a proposed control could interrupt a critical service without an approved exception path.