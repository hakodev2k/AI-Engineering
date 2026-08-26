# Scalability and Capacity Rules

## Purpose
Prevent realtime workloads from exceeding safe resource envelopes.

## Scope
Concurrent sessions, participants, bitrate, CPU, memory, ports, relay allocations, and regional headroom.

## MUST
- Capacity models MUST use measured per-session resource demand and realistic traffic distributions.
- Production regions MUST maintain documented headroom for bursts and failover.
- Admission control MUST activate before resource exhaustion causes broad session failure.
- Capacity assumptions MUST be revalidated after material codec, topology, or feature changes.

## MUST NOT
- MUST NOT size solely from average concurrency.
- MUST NOT ignore network egress or port/socket limits.
- MUST NOT treat synthetic signaling load as representative media load.

## SHOULD
- Forecasts SHOULD include growth, event spikes, and loss of a major failure domain.

## Exceptions
Temporary reduced headroom requires explicit risk acceptance and enhanced monitoring.

## Verification
Use load tests, saturation tests, production percentiles, resource dashboards, and failover-capacity exercises.