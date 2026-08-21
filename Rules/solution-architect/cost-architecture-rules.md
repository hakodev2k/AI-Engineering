# Cost Architecture Rules

## Purpose
Treat cost as an architecture constraint and operational quality attribute without sacrificing required safety or reliability.

## Scope
Covers cloud services, compute, storage, data transfer, licenses, third parties, observability, and operational labor.

## MUST
- Significant designs MUST identify major cost drivers and how cost scales with users, traffic, data, and environments.
- Architecture comparisons MUST include operational and migration cost, not only infrastructure unit price.
- High-cost managed services MUST be justified by measurable value such as reduced risk, effort, or time-to-market.
- Cost controls MUST not weaken required security, backup, observability, or recovery without explicit risk acceptance.
- Unexpected cost growth MUST have observable signals and ownership where financially material.

## MUST NOT
- MUST NOT optimize cost based only on list price while ignoring engineering and operational burden.
- MUST NOT commit to long-term capacity assumptions without usage evidence when reversibility is available.

## SHOULD
- Prefer architectures where cost growth tracks business value.
- Review idle environments, storage growth, egress, telemetry volume, and over-provisioning.

## Exceptions
Early prototypes may favor speed over optimization when spend is bounded.

## Verification
Review cost estimates, billing telemetry, capacity assumptions, license models, egress paths, and operational staffing implications.