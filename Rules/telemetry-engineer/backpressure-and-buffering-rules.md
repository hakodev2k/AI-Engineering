# Backpressure and Buffering Rules

## Purpose
Prevent telemetry systems from amplifying outages or exhausting producer resources.

## Scope
SDK queues, collectors, agents, network exporters, batch processors, and persistent buffers.

## MUST
- Buffers MUST have explicit size, age, and overflow policies.
- Backpressure behavior MUST protect application-critical resources before telemetry completeness.
- Persistent buffering MUST define disk limits, cleanup, and corruption handling.
- Overflow and drop rates MUST be measurable.

## MUST NOT
- MUST NOT allow telemetry queues to grow without a hard bound.
- MUST NOT block critical request paths indefinitely because an exporter is unavailable.
- MUST NOT hide sustained overload behind ever-larger buffers.

## SHOULD
- Shed lower-value telemetry before critical diagnostic signals when prioritization is supported.

## Exceptions
Require measured capacity evidence, failure-mode analysis, monitoring, and approval for material resource risk.

## Verification
Review queue limits, load tests, outage tests, process resource telemetry, and drop counters.