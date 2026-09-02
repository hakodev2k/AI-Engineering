# Cost and Sustainability Alignment Rules

## Purpose
Use cost signals as supporting evidence for resource efficiency without equating financial savings with environmental benefit.

## Scope
Applies to architecture, cloud resource selection, capacity planning, data lifecycle, workload scheduling, and optimization prioritization.

## MUST
- Cost and sustainability outcomes MUST be evaluated separately when a decision materially affects both.
- Cost proxies used for sustainability decisions MUST document where price diverges from energy, emissions, embodied impact, or resource consumption.
- Optimization proposals MUST identify material cost, reliability, performance, security, and sustainability trade-offs.
- Long-term commitments or major platform migrations motivated partly by sustainability MUST use workload evidence and accountable approval.

## MUST NOT
- MUST NOT claim that a cheaper architecture is necessarily more sustainable.
- MUST NOT choose wasteful capacity merely because discounts make it inexpensive.
- MUST NOT shift cost or environmental impact to another team, region, provider, or lifecycle stage and describe the local improvement as a total-system gain.

## SHOULD
- Prefer opportunities that improve both resource efficiency and cost when service quality is preserved.
- Use billing anomalies and unit-cost trends to identify candidates for deeper sustainability investigation.
- Include avoided engineering complexity and operational risk in optimization decisions.

## Exceptions
Exceptions require the financial or contractual constraint, sustainability consequence, alternatives considered, evidence, and review owner.

## Verification
Review billing and utilization data, unit economics, carbon or energy evidence, architecture decisions, commitment assumptions, and before/after total-system measurements.
