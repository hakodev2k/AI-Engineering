# Customer Impact Rules

## Purpose
Keep incident decisions anchored to real customer and business impact.

## Scope
Applies to user-facing degradation, failed transactions, data correctness, latency, availability, and customer support burden.

## MUST
- Quantify affected customers, requests, transactions, regions, or workflows when evidence permits.
- Distinguish total outage, partial degradation, intermittent failure, and latent data impact.
- Reassess impact after each major mitigation.
- Escalate when impact expands to critical customer journeys or protected customer segments.
- Include unresolved customer harm in recovery criteria.

## MUST NOT
- Infer low customer impact solely from low ticket volume.
- Close an incident while known customer-facing corruption or failure remains unbounded.
- Hide materially affected customer groups inside aggregate metrics.

## SHOULD
- Use business and support signals alongside infrastructure telemetry.
- Track both affected population and severity of effect.

## Exceptions
Where exact counts are unavailable, use bounded estimates and state uncertainty explicitly.

## Verification
Compare incident records against product metrics, support signals, transaction data, regional telemetry, and post-recovery checks.