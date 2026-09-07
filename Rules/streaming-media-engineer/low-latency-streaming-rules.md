# Low-Latency Streaming Rules

## Purpose
Reduce glass-to-glass latency without sacrificing stability, compatibility, or recovery behavior.

## Scope
Chunked transfer, partial segments, player buffer targets, origin/CDN behavior, encoder settings, and live synchronization.

## MUST
- Latency targets MUST be defined end to end and decomposed by pipeline stage.
- Low-latency changes MUST measure glass-to-glass latency, rebuffering, startup time, error rate, and recovery behavior together.
- Partial-object publication MUST match origin, cache, and player consistency semantics.
- Reduced buffering MUST retain bounded recovery for network jitter and transient loss.

## MUST NOT
- MUST NOT optimize one stage while claiming end-to-end latency improvement without end-to-end evidence.
- MUST NOT lower buffers below tested operating margins solely to meet a headline latency number.
- MUST NOT enable low-latency features on unsupported clients without negotiation or fallback.

## SHOULD
- Latency telemetry SHOULD identify capture, encode, package, delivery, and player contributions separately.
- Fallback to conventional live delivery SHOULD be available when practical.

## Exceptions
Aggressive latency modes require documented workload constraints, QoE trade-offs, and approval for elevated production risk.

## Verification
Use synchronized end-to-end measurements, network impairment tests, player telemetry, cache traces, and failover tests.