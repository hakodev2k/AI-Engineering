# Multi-Cloud Cost Normalization

## Purpose
Normalize spend and usage across cloud providers so cross-cloud reporting and decisions compare equivalent economic concepts.

## When to use
Use in multi-cloud organizations, provider migration analysis, consolidated reporting, or portfolio-level unit economics.

## Inputs
Provider billing exports, account hierarchies, currencies, discounts, tax treatment, service mappings, allocation rules, usage metrics.

## Context to inspect
Inspect gross versus net cost, amortized commitments, credits, marketplace charges, support, currencies, billing periods, service taxonomy, and provider-specific semantics.

## Core knowledge
Provider bills are not directly comparable. Normalization requires a canonical cost model and explicit treatment of discounts, commitments, shared charges, and currencies. Do not force unlike services into false equivalence.

## Procedure
1. Define canonical reporting dimensions and cost basis.
2. Map provider accounts/projects/subscriptions to organization ownership.
3. Normalize currency and financial period.
4. Standardize gross, net, amortized, and effective cost definitions.
5. Map services to a canonical taxonomy while preserving provider detail.
6. Normalize commitment and credit treatment.
7. Reconcile each provider independently before aggregation.
8. Mark unmapped or ambiguous charges explicitly.
9. Build cross-provider unit metrics only where scopes are comparable.
10. Version mappings as provider products evolve.

## Decision points
Preserve provider-specific categories when normalization would hide important economics. Use a finance-approved FX method for official reporting.

## Common failure patterns
Comparing list cost from one provider to net cost from another, double-counting amortized commitments, ignoring FX timing, and treating similarly named services as equivalent workloads.

## Verification
Normalized totals reconcile to each provider source; mappings are deterministic; currency conversions reproduce; unknown categories remain visible.

## Expected output
A canonical cost model, provider mappings, reconciliation report, ambiguity register, and normalized views.

## Stop conditions
Stop when finance has not defined required currency/accounting treatment for official reporting.