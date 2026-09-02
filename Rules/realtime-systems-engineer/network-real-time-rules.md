# Real-Time Networking Rules

## Purpose
Keep network-dependent deadlines explicit, bounded, and resilient to congestion and loss.

## Scope
Real-time Ethernet, field buses, UDP/TCP transports, middleware, and distributed control traffic.

## MUST
- Networked real-time paths MUST define latency, jitter, loss, duplication, reordering, and partition assumptions.
- Protocol selection MUST account for retransmission, congestion, head-of-line blocking, and queueing behavior.
- Critical messages MUST have bounded queueing or priority treatment consistent with their deadlines.
- Distributed functions MUST define behavior when communication deadlines are missed.

## MUST NOT
- MUST NOT equate average round-trip time with deadline guarantees.
- MUST NOT allow unbounded retransmission or retry storms on deadline-sensitive paths.

## SHOULD
- Use traffic shaping, prioritization, admission control, or time-aware scheduling where justified by requirements.

## Exceptions
Exceptions require network evidence under representative contention and documented failure behavior.

## Verification
Review packet captures, queue configuration, impairment tests, latency distributions, loss tests, and partition behavior.