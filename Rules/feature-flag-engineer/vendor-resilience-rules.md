# Vendor Resilience Rules

## Purpose
Control operational and architectural risk from external feature-management providers.

## Scope
Hosted control planes, SDKs, APIs, pricing, quotas, and provider dependencies.

## MUST
- Critical integrations MUST document provider outage behavior, quotas, rate limits, and support assumptions.
- Vendor changes that affect evaluation semantics or SDK behavior MUST be tested before broad rollout.
- Exit or continuity strategy MUST exist where provider failure would materially threaten core operations.
- Contractual data handling and availability assumptions MUST be understood by responsible owners.

## MUST NOT
- Provider marketing claims MUST NOT substitute for measured application behavior.
- Critical applications MUST NOT assume unlimited API capacity.
- Vendor-specific semantics MUST NOT leak across the codebase without deliberate architecture choice.

## SHOULD
- Abstraction boundaries SHOULD preserve testability and reasonable migration options.

## Exceptions
Deep vendor coupling is acceptable with documented benefits, risks, and ownership.

## Verification
Review architecture, quotas, outage tests, SDK dependency inventory, contracts where applicable, and continuity exercises.