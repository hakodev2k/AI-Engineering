# Cloud Cost Allocation

## Purpose
Build defensible allocation of shared and direct cloud spend to teams, products, environments, and business owners so cost decisions use trustworthy data.

## When to use
Use when introducing showback/chargeback, investigating unowned spend, or improving unit economics. Do not invent ownership where evidence is missing.

## Inputs
Billing exports, account/subscription hierarchy, resource metadata, tags/labels, organization structure, product ownership, shared-service architecture.

## Preconditions
Billing data is accessible for the required period and currencies/tax treatment are understood.

## Context to inspect
Inspect billing granularity, discounts, credits, commitments, shared platforms, data transfer, support charges, marketplace spend, and tagging coverage.

## Core knowledge
Allocation must distinguish direct, shared, and unallocatable cost. Shared-cost rules should be explainable and stable. Allocation accuracy is constrained by cloud billing dimensions and organizational metadata.

## Procedure
1. Define allocation consumers and reporting grain.
2. Inventory billing sources and cost categories.
3. Map direct resources using authoritative ownership signals.
4. Measure metadata coverage and conflicts.
5. Classify shared services and choose allocation drivers such as usage, requests, seats, revenue, or equal split.
6. Treat discounts, commitments, credits, and taxes consistently.
7. Keep genuinely unknown spend visible instead of hiding it.
8. Reconcile allocated totals to the billing source.
9. Publish rules, exceptions, confidence, and owners.
10. Review allocation drift after organizational or architecture changes.

## Decision points
Use showback before chargeback when data quality or organizational trust is immature. Prefer causal usage drivers over arbitrary percentages when measurement cost is reasonable.

## Common failure patterns
Forcing 100% allocation with guessed ownership, double-counting credits, allocating shared platforms only by raw spend, stale tags, and changing rules without restating historical comparisons.

## Verification
Allocated plus unallocated totals reconcile to source billing; sampled resources map to correct owners; shared rules reproduce deterministically; discounts and credits reconcile.

## Expected output
An allocation model, coverage report, reconciliation evidence, ownership gaps, and documented shared-cost rules.

## Stop conditions
Stop and escalate when billing exports are incomplete, currency/tax policy is unresolved, or chargeback rules require finance approval.