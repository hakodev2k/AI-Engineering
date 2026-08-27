# Rate Limiting and Quotas

## Purpose
Protect gateway and backend capacity with fair, measurable traffic controls.

## When to use
Use for abuse prevention, tenant fairness, contractual quotas, burst control, or overload protection.

## Inputs
Traffic distribution, client identities, backend capacity, SLOs, business quota rules.

## Context to inspect
Current request rates, burstiness, retry behavior, shared NATs, tenant identifiers, regional topology.

## Core knowledge
Understand token bucket, leaky bucket, fixed/sliding windows, distributed counters, burst allowance, quota periods, and 429 semantics.

## Procedure
1. Identify the correct limiting key: user, tenant, credential, route, IP, or combination.
2. Separate short-term rate limits from long-term quotas.
3. Size sustained rate and burst capacity from measured backend headroom.
4. Decide local versus distributed enforcement.
5. Return machine-readable limit metadata when appropriate.
6. Coordinate retry guidance to avoid synchronized storms.
7. Exempt only explicitly justified internal flows.
8. Monitor rejected traffic and false-positive impact.

## Decision points
Use local limiting for fast node protection; distributed state for globally consistent tenant quotas. Prefer identity-based keys over IP when identities are available.

## Common failure patterns
IP-only limits behind NAT, no burst allowance, global counters on hot paths, silently dropping requests, retries that amplify throttling.

## Verification
Load-test sustained and burst traffic, fairness across tenants, counter failure behavior, and retry interaction.

## Expected output
Documented, tested rate and quota policies with measurable capacity rationale.

## Stop conditions
Escalate if business quota semantics or reliable client identity is unavailable.