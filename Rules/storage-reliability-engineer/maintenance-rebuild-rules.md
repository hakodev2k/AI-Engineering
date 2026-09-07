# Maintenance and Rebuild Rules

## Purpose
Prevent maintenance and rebuild activity from creating avoidable availability or durability risk.

## Scope
Applies to device replacement, node evacuation, rebuild, rebalance, scrub, compaction, and maintenance windows.

## MUST
- Quantify redundancy state and recovery headroom before taking storage components offline.
- Rate-limit rebuild or rebalance work when foreground service objectives are threatened.
- Confirm the system returns to healthy redundancy after maintenance.

## MUST NOT
- Begin concurrent maintenance that removes required fault tolerance without approved risk acceptance.
- Cancel rebuilds solely to reduce load without evaluating resulting durability exposure.
- Declare maintenance complete while degraded replicas, failed jobs, or unresolved alerts remain unexplained.

## SHOULD
- Stagger disruptive maintenance across independent failure domains.
- Track rebuild duration trends as capacity and risk signals.

## Exceptions
Emergency repair may bypass normal sequencing only with incident authority, documented exposure, and continuous monitoring.

## Verification
Inspect health state, redundancy metrics, rebuild logs, latency telemetry, maintenance records, and post-change checks.