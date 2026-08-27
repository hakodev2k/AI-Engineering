# Production Monitoring Rules

## Purpose
Connect offline evaluation evidence to real production behavior and detect quality drift after release.

## Scope
Applies to production AI systems whose behavior may change because of traffic mix, data drift, provider changes, retrieval updates, tool dependencies, or user interaction patterns.

## MUST
- Production monitoring MUST track quality proxies or sampled evaluations tied to known critical behaviors where direct labels are unavailable.
- Offline metrics used for release decisions MUST be compared with production indicators to detect distribution mismatch.
- Material drift in traffic, retrieval sources, tool outcomes, refusal rates, failure rates, latency, or cost MUST trigger investigation when relevant.
- Production samples used for evaluation MUST follow privacy, access, retention, and redaction requirements.
- Monitoring alerts MUST define an owner and an actionable response path.

## MUST NOT
- MUST NOT assume offline benchmark stability guarantees production stability.
- MUST NOT collect sensitive production content merely because it could improve evaluation coverage.
- MUST NOT ignore sustained metric deterioration because no explicit user complaint has been filed.

## SHOULD
- Monitoring SHOULD combine automated signals with periodic human review of representative samples.
- High-impact products SHOULD maintain canary or shadow evaluation mechanisms for risky changes where feasible.

## Exceptions
Systems with no production telemetry may rely on controlled sampling or support-derived evidence if the limitation and residual risk are documented.

## Verification
Inspect dashboards, sampled evaluation jobs, drift thresholds, alert routing, privacy controls, incident links, and evidence connecting offline benchmarks to observed production outcomes.