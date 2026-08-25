# Load Shedding Rules

## Purpose
Protect overall service availability by rejecting excess work predictably before uncontrolled saturation.

## Scope
Admission control, queue limits, concurrency limits, overload responses, priority traffic, and circuit breaking at the traffic tier.

## MUST
- Overload policy MUST define which resource or signal triggers shedding and how rejected clients are informed.
- Limits MUST be chosen from measured capacity and downstream constraints.
- Critical traffic classes MUST have explicit priority semantics when differentiated service is required.
- Shedding behavior MUST preserve health-check and recovery traffic needed to restore service.
- Changes MUST be tested under overload and recovery conditions.

## MUST NOT
- MUST NOT allow queues or concurrency to grow without bound.
- MUST NOT shed traffic using discriminatory or security-sensitive attributes without approved policy.
- MUST NOT return misleading success responses for rejected work.

## SHOULD
- Fail fast before deep queues cause timeout cascades.
- Coordinate load shedding with retry policy so rejected requests do not amplify overload.

## Exceptions
Temporary limit changes during incidents require evidence, monitoring, and incident authority.

## Verification
Run overload tests; inspect queue depth, rejection rates, latency, backend saturation, retry amplification, recovery time, and priority behavior.