# Quality of Service Rules

## Purpose
Protect traffic classes under contention using explicit, measurable policy.

## Scope
Classification, marking, queuing, shaping, policing, and congestion management.

## MUST
- Tie QoS classes to documented application requirements and trust boundaries.
- Validate marking behavior end to end and define where markings are trusted or rewritten.
- Size priority treatment using measured demand and platform constraints.
- Test policy under realistic congestion before claiming protection.

## MUST NOT
- Put broad or unbounded traffic into strict-priority classes.
- Use QoS to conceal chronic under-capacity without a capacity plan.

## SHOULD
- Keep class models small and consistent across administrative domains.

## Exceptions
Temporary prioritization requires evidence, owner, expiry, and impact analysis on other traffic.

## Verification
Inspect class maps/policy, packet markings, queue counters, drops, congestion tests, and application latency.