# Routing and Canary Rules

## Purpose
Control how requests are assigned across model versions and serving pools.

## Scope
Applies to weighted routing, canaries, shadow traffic, A/B paths, fallbacks, and model selection.

## MUST
- Make routing policy explicit, observable, and reversible.
- Define success and abort criteria before exposing a new model or runtime to production traffic.
- Preserve tenant, capability, and compatibility constraints during routing decisions.
- Compare canary and baseline using equivalent workload slices where practical.

## MUST NOT
- Shift significant production traffic without health evidence and rollback capability.
- Route requests to incompatible model versions silently.
- Use shadow traffic in ways that duplicate irreversible side effects.

## SHOULD
- Increase exposure progressively based on measured error, latency, quality, and resource behavior.
- Keep routing decisions traceable per request.

## Exceptions
Emergency rerouting requires incident authority, documented risk, and post-change verification.

## Verification
Review routing config, canary dashboards, request traces, abort thresholds, and rollback tests.